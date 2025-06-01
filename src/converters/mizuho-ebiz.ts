// src/converters/mizuho-ebiz.ts
import { nanoid } from 'nanoid';
import { z } from 'zod';
import type { TransactionRow } from '@/types/transaction';
import type { BankCode }        from '@/types/bank';

/** この converter 自身の銀行コード */
export const BANK_CODE = 'mizuhoebiz' satisfies BankCode;

/** 元 CSV の列スキーマ */
const Raw = z.object({
  '操作日(年)': z.string(),
  '操作日(月)': z.string(),
  '操作日(日)': z.string(),
  '摘要':        z.string(),
  'お預り金額':  z.string().optional().default(''),
  'お支払金額':  z.string().optional().default(''),
  '残高':        z.string().optional(),
  'メモ':        z.string().optional().default('')
});

/** カンマ除去 + 空欄→0 */
const yen = (v?: string) => (v && v.trim() ? Number(v.replace(/,/g, '')) : 0);

export function convertMizuhoEbiz(raw: Record<string,string>): TransactionRow {
  const r = Raw.parse(raw);

  const date = `${r['操作日(年)']}/${Number(r['操作日(月)'])}/${Number(r['操作日(日)'])}`;
  const credit = yen(r['お預り金額']);
  const debit  = yen(r['お支払金額']);

  return {
    id:   nanoid(),
    bank: BANK_CODE,
    date,
    description: r['摘要'].trim(),
    credit,
    debit,
    balance: yen(r['残高']),
    memo: r['メモ']?.trim() || undefined
  };
}
