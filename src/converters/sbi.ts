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
    const credit = parseNumber(raw['入金金額(円)'])
    const debit  = parseNumber(raw['出金金額(円)'])
  
    return {
      id        : crypto.randomUUID(),
      bank      : BANK_CODE,
      date   : raw['取引日'],
      description: raw['内容'],
      credit : parseYen(raw['入金金額(円)']),
      debit  : parseYen(raw['出金金額(円)']),
      balance: parseYen(raw['残高(円)']),
      memo      : raw['メモ']?.trim() ?? ''
    }
  }
  /** 「1,234」→1234、空欄→0 を保証 */
function parseYen(src?: string) {
  if (!src) return 0;
  return Number(src.replaceAll(',', '')) || 0;
}

  function parseNumber(v?: string) {
    if (!v) return undefined
    return Number(v.replaceAll(',', '')) || 0
  }

export function toCsv(rows: TransactionRow[]): string {
  const header = ['取引日', '内容', '入金', '出金', '残高'].join(',');
  const body = rows
    .filter(r => r.bank === BANK_CODE)
    .map(r =>
      [
        r.date,
        r.description,
        r.credit ?? 0,   // 0 埋め
        r.debit  ?? 0,
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
        r.credit ?? 0,
        r.debit  ?? 0,
        r.balance ?? ''
      ].join(',')
    )
    .join('\n');
  return `${header}\n${body}`;
}

