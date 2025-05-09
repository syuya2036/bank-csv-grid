// src/utils/summary.ts
import { TransactionRow } from '@/schemas/transactionRow';
import { Column } from 'react-data-grid';

export function buildColumns(): Column<TransactionRow>[] {
  return [
    { key: 'date', name: '日付', editable: true, sortable: true },
    { key: 'description', name: '摘要', editable: true, width: 200 },
    { key: 'credit', name: '入金', editable: true },
    { key: 'debit', name: '出金', editable: true }
  ];
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