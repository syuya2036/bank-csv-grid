// src/converters/gmo.ts
import { z } from 'zod';
import { nanoid } from 'nanoid';
import type { BankCode } from '@/types/bank';
import type { TransactionRow } from '@/types/transaction';

/** 「1,234」→ 1234／空欄→ 0 を保証 */
const parseYen = (v?: string) =>
  v && v.trim() ? Number(v.replace(/,/g, '')) : 0;

/** この converter 固有の銀行コード */
export const BANK_CODE = 'gmo' satisfies BankCode;

/** GMO あおぞら銀行 CSV ヘッダー仕様 */
const Schema = z.object({
  '取引日':       z.string(),          // 20240401
  '摘要':       z.string(),
  '入金金額':   z.string().optional(),
  '出金金額':   z.string().optional(),
  '残高':       z.string().optional(),
  'メモ':       z.string().optional()
});

/** 1 行 → TransactionRow */
export function convertGmo(raw: Record<string, string>): TransactionRow {
    const parsed = Schema.safeParse(raw);
    if (!parsed.success) {
      /* 例外を投げて上位でスキップさせる */
      throw new Error('GMO parse error');
    }
    const r = parsed.data;
  
    /* 取引日: 20240401 → 2024/4/1 */
    const y = r['取引日'].slice(0, 4);
    const m = String(parseInt(r['取引日'].slice(4, 6), 10));
    const d = String(parseInt(r['取引日'].slice(6, 8), 10));
    const date = `${y}/${m}/${d}`;
  
    return {
      id:   nanoid(),
      bank: BANK_CODE,
      date,
      description: r['摘要'],
      credit : parseYen(r['入金金額']),
      debit  : parseYen(r['出金金額']),
      balance: r['残高'] ? parseYen(r['残高']) : undefined,
      memo   : r['メモ']?.trim() || undefined,
      isRegistered: false,            // ★ 新規行は必ず false
    };
}
