import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

type Node = {
	id: string;
	name: string;
	order: number;
	active: boolean;
	debit: number;
	credit: number;
	children: Node[];
};

function parseYMD(v: string | null): { y: number; m: number; d: number } | null {
	if (!v) return null;
	const s = v.trim().replace(/\./g, '-').replace(/\//g, '-');
	const m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	if (!m) return null;
	const y = parseInt(m[1], 10);
	const mo = parseInt(m[2], 10);
	const d = parseInt(m[3], 10);
	if (!y || !mo || !d) return null;
	return { y, m: mo, d };
}

function startOfDayLocal(ymd: { y: number; m: number; d: number }): Date {
	return new Date(ymd.y, ymd.m - 1, ymd.d, 0, 0, 0, 0);
}

function endOfDayLocal(ymd: { y: number; m: number; d: number }): Date {
	return new Date(ymd.y, ymd.m - 1, ymd.d, 23, 59, 59, 999);
}

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const fromYMD = parseYMD(searchParams.get('from'));
		const toYMD = parseYMD(searchParams.get('to'));
		const bank = searchParams.get('bank');

		const tags = await prisma.tag.findMany({
			orderBy: [{ parentId: 'asc' }, { order: 'asc' }, { name: 'asc' }],
		});

		const byId = new Map<string, any>();
		const childrenByParent = new Map<string | null, string[]>();
		for (const t of tags) {
			byId.set(t.id, t);
			const p = (t as any).parentId ?? null;
			const arr = childrenByParent.get(p) ?? [];
			arr.push(t.id);
			childrenByParent.set(p, arr);
		}

		const whereTx: any = {};
		if (fromYMD || toYMD || bank) {
			if (bank) whereTx.bank = bank;
			if (fromYMD || toYMD) {
				whereTx.date = {
					...(fromYMD ? { gte: startOfDayLocal(fromYMD) } : {}),
					...(toYMD ? { lte: endOfDayLocal(toYMD) } : {}),
				};
			}
		}

		const assigns = await prisma.tagAssignment.findMany({
			where: Object.keys(whereTx).length ? { transaction: whereTx } : {},
			include: { transaction: { select: { credit: true, debit: true } } },
		});

		// legacy フィールド `Transaction.tag` のフォールバック集計
		// すでに TagAssignment がある取引は除外して二重計上を防ぐ
		const assignedTxIds = new Set(assigns.map((a) => a.transactionId));
		const legacyWhere: any = { ...(Object.keys(whereTx).length ? whereTx : {}), tag: { not: null } };
		// 空文字や空白のみは除外
		const legacyTx = await prisma.transaction.findMany({
			where: legacyWhere,
			select: { id: true, tag: true, credit: true, debit: true },
		});

		const totals = new Map<string, { debit: number; credit: number }>();

		function addTo(id: string, debit: number, credit: number) {
			const cur = totals.get(id) ?? { debit: 0, credit: 0 };
			cur.debit += debit;
			cur.credit += credit;
			totals.set(id, cur);
		}

		function addToAncestors(tagId: string, debit: number, credit: number) {
			let current: string | null = tagId;
			while (current) {
				addTo(current, debit, credit);
				const t: any = byId.get(current);
				current = t ? (t.parentId ?? null) : null;
			}
		}

		for (const a of assigns) {
			const debit = typeof a.transaction.debit === 'number' ? Math.max(0, Math.trunc(a.transaction.debit)) : 0;
			const credit = typeof a.transaction.credit === 'number' ? Math.max(0, Math.trunc(a.transaction.credit)) : 0;
			if (debit === 0 && credit === 0) continue;
			addToAncestors(a.tagId, debit, credit);
		}

		// legacy タグ名 → Tag.id 解決（同名複数ある場合は最初のもの）
		const byName = new Map<string, string>();
		for (const t of tags) {
			if (!byName.has(t.name)) byName.set(t.name, (t as any).id);
		}
		for (const tx of legacyTx) {
			if (!tx.tag) continue;
			if (assignedTxIds.has(tx.id)) continue; // 既に assignments でカウント済み
			const name = String(tx.tag).trim();
			if (!name) continue;
			const tagId = byName.get(name);
			if (!tagId) continue; // タグマスターに存在しない
			const debit = typeof tx.debit === 'number' ? Math.max(0, Math.trunc(tx.debit)) : 0;
			const credit = typeof tx.credit === 'number' ? Math.max(0, Math.trunc(tx.credit)) : 0;
			if (debit === 0 && credit === 0) continue;
			addToAncestors(tagId, debit, credit);
		}

		function build(parentId: string | null): Node[] {
			const ids = childrenByParent.get(parentId) ?? [];
			return ids.map((id) => {
				const t: any = byId.get(id);
				const sum = totals.get(id) ?? { debit: 0, credit: 0 };
				return {
					id: t.id,
					name: t.name,
					order: t.order ?? 0,
					active: t.active ?? true,
					debit: sum.debit,
					credit: sum.credit,
					children: build(t.id),
				} as Node;
			});
		}

		const tree = build(null);
		return NextResponse.json({
			from: fromYMD ? startOfDayLocal(fromYMD).toISOString() : null,
			to: toYMD ? endOfDayLocal(toYMD).toISOString() : null,
			bank: bank ?? null,
			tree
		});
	} catch (e) {
		console.error('[API /report GET]', e);
		return NextResponse.json({ error: String(e) }, { status: 500 });
	}
}
