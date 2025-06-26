// src/components/TransactionGrid.tsx
'use client';

import React from 'react';
import { DataGrid, RowsChangeData } from 'react-data-grid';
import { buildColumns, GridKey } from '@/utils/columns';
import type { TransactionRow } from '@/types/transaction';
// 追加インポート
import { defaultColumnOptions } from '@/utils/gridDefaults';

type TransactionGridProps = {
  rows: TransactionRow[];
  onRowsChange: (rows: TransactionRow[]) => void;
};

export default function TransactionGrid({
  rows,
  onRowsChange
}: TransactionGridProps) {
  if (rows.length === 0) {
    return <p>データがありません</p>;
  }

  const columns = buildColumns(Object.keys(rows[0]) as GridKey[]);

  return (
    <div className="w-full h-[600px]">
      <DataGrid
        columns={columns}
        rows={rows}
        rowKeyGetter={(row: TransactionRow) => row.id.toString()}
        onRowsChange={(
          updatedRows: TransactionRow[],
          data: RowsChangeData<TransactionRow>
        ) => {
          console.debug('TransactionGrid onRowsChange, firstRow=', updatedRows[0]);
          onRowsChange(updatedRows);
        }}
        // ここでクリック即編集を有効化
        defaultColumnOptions={defaultColumnOptions}
      />
    </div>
  );
}
