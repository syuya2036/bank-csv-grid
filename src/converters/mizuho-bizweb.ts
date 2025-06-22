import { nanoid } from 'nanoid';
import { z } from 'zod';
import { parseYen } from '@/utils/parseYen';
import { normalizeDate } from '@/utils/normalizeDate';
import type { TransactionRow } from '@/types/transaction';
import type { BankCode } from '@/types/bank';

/** この converter 自身の銀行コード */
export const BANK_CODE = 'mizuhobizweb' satisfies BankCode;

/** みずほ BizWeb → 共通 6 列名への対応表（参考用） */
export const HEADER_MAP: Record<string, string> = {
  勘定日: '取引日',
  摘要: '内容',
  '入金（円）': '入金',
  '出金（円）': '出金',
  '残高（円）': '残高'
};

/** 元 CSV 1 行ぶんの検証スキーマ */
const RawSchema = z.object({
  勘定日: z.string(),
  摘要: z.string(),
  '入金（円）': z.string().optional().default(''),
  '出金（円）': z.string().optional().default(''),
  '残高（円）': z.string().optional().default(''),
  金融機関名: z.string().optional(),
  支店名: z.string().optional(),
  取引区分: z.string().optional(),
  明細区分: z.string().optional()
});

/** 「yyyy年m月d日」なども normalizeDate へ渡せる形式にする */
function formatDate(src: string): string {
  // 「yyyy/mm/dd」ならそのまま
  if (src.includes('/')) return normalizeDate(src);
  // 「yyyy年m月d日」→ yyyy/mm/dd
  const t = src.replace(/年|月/g, '/').replace(/日/, '');
  return normalizeDate(t);
}

/** 変換本体 */
export function convertMizuhoBizweb(raw: Record<string, string>): TransactionRow {
  const r = RawSchema.parse(raw);

  const credit = parseYen(r['入金（円）']);
  const debit  = parseYen(r['出金（円）']);
  const balance = parseYen(r['残高（円）']);

  /** メモ列に付加情報をまとめる（無ければ省略） */
  const memo = [
    r.金融機関名,
    r.支店名,
    r.取引区分,
    r.明細区分
  ].filter(Boolean).join(' ') || undefined;

  return {
    id: nanoid(),
    bank: BANK_CODE,
    date: formatDate(r.勘定日),
    description: r.摘要.trim(),
    credit,
    debit,
    balance: balance || undefined,
    memo
  };
}
