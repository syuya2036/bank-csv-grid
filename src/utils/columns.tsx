'use client';

import React from 'react';
import type { Column } from 'react-data-grid';
import type { TransactionRow } from '@/types/transaction';
import type { EditorProps, FormatterProps } from '@/types/react-data-grid';
import TagSelectEditor from '@/components/TagSelectEditor';

/** セル表示用フォーマッタ */
function TagCellFormatter({ row }: FormatterProps<TransactionRow>) {
  return (
    <div
      className={`px-1 rounded text-xs ${
        row.tag ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-600'
      }`}
    >
      {row.tag || '未割当'}
    </div>
  );
}

export type GridKey = keyof TransactionRow;

const JP_NAME: Record<GridKey, string> = {
  id: 'ID',
  bank: '銀行',
  date: '取引日',
  description: '内容',
  credit: '入金',
  debit: '出金',
  balance: '残高',
  memo: 'メモ',
  tag: 'タグ',
};

export function buildColumns(keys: GridKey[]): Column<TransactionRow>[] {
  return keys.map((key) => {
    if (key === 'tag') {
      return {
        key: 'tag',
        name: JP_NAME.tag,
        width: 140,
        editable: true,
        // カスタム型を利用
        editor: (p: EditorProps<TransactionRow>) => (
          <TagSelectEditor {...p} />
        ),
        formatter: (p: FormatterProps<TransactionRow>) => (
          <TagCellFormatter {...p} />
        ),
      } as Column<TransactionRow>;
    }

    return {
      key,
      name: JP_NAME[key],
      resizable: false,
      width: 110,
    } as Column<TransactionRow>;
  });
}
