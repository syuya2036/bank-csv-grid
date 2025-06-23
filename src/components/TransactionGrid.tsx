// src/components/TransactionGrid.tsx
'use client';
import React, { useMemo } from 'react';
import { DataGrid, type Column } from 'react-data-grid';
import type { TransactionRow } from '@/types/transaction';
import { buildColumns, type GridKey } from '@/utils/columns';
import { defaultColumnOptions } from '@/utils/gridDefaults';
import { calcSummary, type SummaryRow } from '@/utils/summary';

interface Props {
  rows: TransactionRow[];
  onRowsChange(r: TransactionRow[]): void;
}

export default function TransactionGrid({ rows, onRowsChange }: Props) {
  // 表示する列キーを指定
  const visible: GridKey[] = [
    'id',
    'bank',
    'date',
    'description',
    'credit',
    'debit',
    'balance',
    'memo'
  ];
  const columns = useMemo(() => buildColumns(visible), [visible]);

  return (
    <DataGrid<TransactionRow | SummaryRow, unknown, string>
      className="rdg-light h-[600px] overflow-x-auto"
      columns={columns as Column<any>[]}
      rows={rows}
      onRowsChange={(updated) => onRowsChange(updated as TransactionRow[])}
      rowKeyGetter={(r) => r.id}
      defaultColumnOptions={defaultColumnOptions}
      bottomSummaryRows={[calcSummary(rows)]}
    />
  );
}
