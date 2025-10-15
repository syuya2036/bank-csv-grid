import { prisma } from '@/lib/prisma';
import type { TagType } from '@/types/tag';

export type TagNode = {
	id: string;
	name: string;
	active: boolean;
	order: number;
	children: TagNode[];
	type?: TagType;
};

export type BuildTreeOptions = {
	onlyActive?: boolean;
	excludeKPI?: boolean;
};

export async function getTagTree(opts: BuildTreeOptions = {}): Promise<TagNode[]> {
	const { onlyActive = true, excludeKPI = false } = opts;
	const tags = await prisma.tag.findMany({
		where: onlyActive ? { active: true } : {},
		orderBy: [{ parentId: 'asc' }, { order: 'asc' }, { name: 'asc' }],
	});

	const byParent = new Map<string | null, any[]>();
	for (const t of tags) {
		const key = (t as any).parentId ?? null;
		const arr = byParent.get(key) ?? [];
		arr.push(t);
		byParent.set(key, arr);
	}

	function build(parentId: string | null): TagNode[] {
		const list = byParent.get(parentId) ?? [];
		const mapped = list
			.map((t) => ({
				id: t.id,
				name: t.name,
				active: (t as any).active ?? true,
				order: (t as any).order ?? 0,
				type: (t as any).type as TagType | undefined,
				children: build(t.id),
			}))
			.filter((n) => (excludeKPI ? n.type !== 'KPI' : true));
		return mapped;
	}

	return build(null);
}
