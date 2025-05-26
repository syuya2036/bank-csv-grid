// src/utils/summary.ts
import type { Column } from 'react-data-grid';
import type { TransactionRow } from '@/types/transaction';

/** カンマ区切りフォーマッタ（0 → ''） */
const yenFmt = (v?: number) => (v ? v.toLocaleString('ja-JP') : '');

const header: Record<keyof TransactionRow, string> = {
  id: 'ID',
  bank: '銀行',
  date: '日付',
  description: '摘要',
  credit: '入金',
  debit: '出金',
  balance: '残高',
  memo: 'メモ'
};

/**
 * 列定義を生成する
 * @param keys 表示したいフィールド。省略時は主要列を表示
 */
export function buildColumns(
  keys: (keyof TransactionRow)[] = [
    'date',
    'description',
    'credit',
    'debit',
    'balance',
    'memo'
  ]
): Column<TransactionRow, unknown>[] {
  return keys.map((k): Column<TransactionRow> => {
    const base = { key: k, name: header[k] };

    if (k === 'credit' || k === 'debit' || k === 'balance') {
      return {
        ...base,
        renderCell: ({ row }) => yenFmt(row[k])
      };
    }
    return base;
  });
}

export function calcSummary(rows: TransactionRow[]) {
  return rows.reduce(
    (acc, r) => {
      acc.credit += r.credit;
      acc.debit += r.debit;
      return acc;
    },
    { credit: 0, debit: 0 }
  );
}
