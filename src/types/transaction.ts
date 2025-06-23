// Path: src/types/transaction.ts
import type { BankCode } from './bank';

export interface TransactionRow {
  id: string;
  bank: BankCode;         // ← **string ではなく BankCode**
  date: string;
  description: string;
  credit: number;
  debit: number;
  balance?: number;
  memo?: string;
  tag?: string;      // ← 新規
}
