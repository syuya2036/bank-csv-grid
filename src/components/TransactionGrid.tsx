// src/components/TransactionGrid.tsx
'use client';
import { DataGrid,  type Column } from 'react-data-grid';
import type { TransactionRow } from '@/types/transaction';
import { useState } from 'react';
import { buildColumns } from '@/utils/summary';

interface Props { rows: TransactionRow[]; onRowsChange(r: TransactionRow[]): void }

export default function TransactionGrid({ rows, onRowsChange }: Props) {
  const [columns] = useState(() => buildColumns());
  return (
    <DataGrid
      className="rdg-light h-[600px]"
      columns={columns as Column<any>[]}
      rows={rows}
      onRowsChange={(rows /* ←更新後配列 */, _data) =>
              onRowsChange(rows as TransactionRow[])
            }
      rowKeyGetter={(row: TransactionRow) => row.id}
    />
  );
}