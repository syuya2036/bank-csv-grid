// src/converters/paypay.ts

import { z } from 'zod'
import { nanoid } from 'nanoid'
import type { TransactionRow } from '@/types/transaction'
import type { BankCode } from '@/types/bank'

/**
 * この converter 自身の銀行コード
 */
export const BANK_CODE = 'paypay' satisfies BankCode

/**
 * PayPay銀行 CSV の 1 行を共通スキーマへ変換
 *
 *  ── PayPay CSV 列 ────────────
 *  操作日(年)・(月)・(日) ／ 操作時刻(時)(分)(秒)
 *  摘要, 取引順番号
 *  お預り金額, お支払金額
 *  残高, メモ
 */

/* 生データ検証用スキーマ */
const Raw = z.object({
  '操作日(年)':   z.string(),
  '操作日(月)':   z.string(),
  '操作日(日)':   z.string(),
  '操作時刻(時)': z.string().optional(),
  '操作時刻(分)': z.string().optional(),
  '操作時刻(秒)': z.string().optional(),
  '摘要':         z.string(),
  '取引順番号':   z.string().optional(),
  'お預り金額':   z.string(),
  'お支払金額':   z.string(),
  '残高':         z.string().optional(),
  'メモ':         z.string().optional()
})

export function convertPaypay(raw: unknown): TransactionRow {
  const r = Raw.parse(raw)

  // 日付を YYYY/MM/DD 形式へ
  const date =
    `${r['操作日(年)']}/${r['操作日(月)'].padStart(2, '0')}/${r['操作日(日)'].padStart(2, '0')}`

  // 金額は空文字なら 0、カンマ無しなのでそのまま Number 化
  const credit = Number(r['お預り金額']  || 0)
  const debit  = Number(r['お支払金額'] || 0)
  const balance = r['残高'] ? Number(r['残高']) : undefined

  return {
    id:   nanoid(),
    bank: BANK_CODE,
    date,
    description: r['摘要'],
    credit,
    debit,
    balance,
    memo: r['メモ'] || '',
    isRegistered: false,            // ★ 新規行は必ず false
  }
}