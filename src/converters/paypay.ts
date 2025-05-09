// src/converters/paypay.ts
import { nanoid } from 'nanoid';
import { TransactionRow } from '@/schemas/transactionRow';

export const BANK_CODE = 'paypay' as const;

export function convertPayPay(raw: Record<string, string>): TransactionRow {
    // TODO mapping
    return {
      id: nanoid(),
      bank: 'paypay',
      date: raw['取引日時'] ?? '',
      description: raw['摘要'] ?? '',
      credit: Number(raw['入金額'] ?? 0),
      debit: Number(raw['出金額'] ?? 0)
    };
  }
  
  
  export function toCsvPayPay(rows: TransactionRow[]): string {
    /** TODO: 実装 */
    return rows.map(r => Object.values(r).join(',')).join('\n');
  }
  