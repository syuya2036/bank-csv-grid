// Path: src/types/transaction.ts
import type { BankCode } from './bank';

export interface TransactionRow {
  id: string;
  bank: BankCode;
  date: string;
  description: string;
  credit: number;
  debit: number;
  balance?: number;
  memo?: string;
  tag?: string;
  isRegistered: boolean;
  /** クライアント側だけで使う「未反映フラグ」 */
  isDirty?: boolean;
}
