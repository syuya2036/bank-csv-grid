/* path: src/converters/sbi.ts */
import { nanoid } from 'nanoid';
import { parseISO, format } from 'date-fns';
import { z } from 'zod'
import type { TransactionRow } from '@/types/transaction'
import type { BankCode } from '@/types/bank'

/**
 * この converter 自身の銀行コード
 */
export const BANK_CODE = 'sbi' satisfies BankCode

/**
 * 住信SBIネット銀行 CSV の列スキーマ
 * - 入金／出金 はどちらか一方しか入らない場合があるので optional
 */
const RawSchema = z.object({
  '取引日': z.string(),
  '内容':   z.string(),
  '入金金額(円)': z.string().optional().default(''),
  '出金金額(円)': z.string().optional().default(''),
  '残高(円)':     z.string().optional(),
})

/**
 * 住信SBIネット銀行 CSV → 共通 TransactionRow
 */
export function convertSbi(raw: Record<string, string>): TransactionRow {
  const data = RawSchema.parse(raw)

  const credit = + (data['入金金額(円)']!.replace(/,/g, '') || 0)
  const debit  = + (data['出金金額(円)']!.replace(/,/g, '') || 0)

  return {
    id: crypto.randomUUID(),
    bank: BANK_CODE,
    date: data['取引日'],
    description: data['内容'],
    credit,
    debit,
    balance: data['残高(円)']
              ? +data['残高(円)']!.replace(/,/g, '')
              : undefined,
  }
}

export function toCsv(rows: TransactionRow[]): string {
  const header = ['取引日', '内容', '入金', '出金', '残高'].join(',');
  const body = rows
    .filter(r => r.bank === BANK_CODE)
    .map(r =>
      [
        r.date,
        r.description,
        r.credit || '',
        r.debit || '',
        r.balance ?? ''
      ].join(',')
    )
    .join('\n');
  return `${header}\n${body}`;
}

export function toCsvSbi(rows: TransactionRow[]): string {
  const header = ['取引日', '内容', '入金', '出金', '残高'].join(',');
  const body = rows
    .filter(r => r.bank === BANK_CODE)
    .map(r =>
      [
        r.date,
        r.description,
        r.credit || '',
        r.debit || '',
        r.balance ?? ''
      ].join(',')
    )
    .join('\n');
  return `${header}\n${body}`;
}