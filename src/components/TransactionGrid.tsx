// src/components/TransactionGrid.tsx
'use client';
import { DataGrid, type Column } from 'react-data-grid';
import type { TransactionRow } from '@/types/transaction';
import { useState } from 'react';
import { buildColumns } from '@/utils/summary';

interface Props {
  rows: TransactionRow[];
  onRowsChange(r: TransactionRow[]): void;
}

export default function TransactionGrid({ rows, onRowsChange }: Props) {
  /** グリッドに出したい列（表示順）を宣言 */
  const visible: (keyof TransactionRow)[] = [
    'date',
    'description',
    'credit',
    'debit',
    'balance',
    'memo'
  ];
  const [columns] = useState(() => buildColumns());

  return (
    <div className="overflow-x-auto">
      <DataGrid
        className="rdg-light h-[600px] min-w-full"
        columns={columns as Column<any>[]}
        rows={rows}
        onRowsChange={(r /* 更新後配列 */, _d) =>
          onRowsChange(r as TransactionRow[])
        }
        rowKeyGetter={(row: TransactionRow) => row.id}
      />
    </div>
  );
}
