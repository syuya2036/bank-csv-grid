// src/components/TransactionGrid.tsx
'use client';
import {
  DataGrid,
  type Column,
  type DefaultColumnOptions
} from 'react-data-grid';
import type { TransactionRow } from '@/types/transaction';
import { useState } from 'react';
import { buildColumns } from '@/utils/summary';

interface Props {
  rows: TransactionRow[];
  onRowsChange(r: TransactionRow[]): void;
}

export default function TransactionGrid({ rows, onRowsChange }: Props) {
  /** グリッドに出したい列（表示順） */
  const visible: (keyof TransactionRow)[] = [
    'date',
    'description',
    'credit',
    'debit',
    'balance',
    'memo'
  ];
  const [columns] = useState(() => buildColumns(visible));

  /** 幅 0 で消えるのを防ぐ共通設定 */
  const defaultCol: DefaultColumnOptions<TransactionRow, unknown> = {
    resizable: true,
    width: 110
  };

  return (
    <DataGrid
      className="rdg-light h-[600px] overflow-x-auto"
      columns={columns as Column<any>[]}
      rows={rows}
      onRowsChange={(updated, _d) => onRowsChange(updated as TransactionRow[])}
      rowKeyGetter={(r: TransactionRow) => r.id}
      defaultColumnOptions={defaultCol}
    />
  );
}
