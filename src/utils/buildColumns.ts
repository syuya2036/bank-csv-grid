// src/utils/buildColumns.ts
import type { Column }            from 'react-data-grid';
import type { TransactionRow }    from '@/types/transaction';
import TagSelectEditor            from '@/components/TagSelectEditor';
import { parseYen }               from '@/utils/parseYen';
import React from 'react';
import type { RenderCellProps, RenderEditCellProps } from 'react-data-grid';


/**
 * DataGrid 用の取引テーブル列定義を返す
 */
export function buildColumns(): Column<TransactionRow>[] {
  return [
    { key: 'date',        name: '取引日',   resizable: true },
    { key: 'description', name: '適用',     resizable: true },
    {
      key: 'credit',
      name: '入金',
      resizable: true,
      renderCell: ({ row }: { row: TransactionRow }) =>
        parseYen(String(row.credit)).toLocaleString(),
    },
    {
      key: 'debit',
      name: '出金',
      resizable: true,
      renderCell: ({ row }: { row: TransactionRow }) =>
        parseYen(String(row.debit)).toLocaleString(),
    },
    {
      key: 'balance',
      name: '残高',
      resizable: true,
      renderCell: ({ row }: { row: TransactionRow }) =>
        row.balance != null
          ? parseYen(String(row.balance)).toLocaleString()
          : '',
    },
    { key: 'memo', name: 'メモ', resizable: true },
    {
      key:            'tag',
      name:           'タグ',
      width:          120,
      editable:       true,
      renderEditCell: TagSelectEditor,
    },
    
  ];
}
