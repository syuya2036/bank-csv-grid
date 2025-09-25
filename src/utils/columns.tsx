// src/utils/columns.tsx:1-68
'use client';
import React from 'react';
import type {
  Column,
  RenderCellProps,
  RenderEditCellProps
} from 'react-data-grid';
import type { TransactionRow } from '@/types/transaction';
import TagSelectEditor from '@/components/TagSelectEditor';

/* ------- セルフォーマッタ ------------ */
export function TagCellFormatter({ row }: RenderCellProps<TransactionRow>) {
  let style = 'bg-gray-200 text-gray-500'; // 未割当（TagAssignmentなし）
  let label = '未割当';

  if (row.tag) {
    label = row.tag;
    style = row.isRegistered && !row.isDirty
      ? 'bg-green-100 text-green-800'   // 反映済
      : 'bg-yellow-100 text-yellow-800';// 未反映
  }

  return <div className={`px-1 rounded text-xs ${style}`}>{label}</div>;
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
  isRegistered: '登録済み',
  isDirty: '未反映',   
} as const;

// narrow helper
function narrow<K extends GridKey>(k: K): K {
  return k;
}

export function buildColumns(
  keys: GridKey[],
  allowEditRegistered = false
): Column<TransactionRow>[] {
  return keys
    .filter((k): k is GridKey => k !== 'isDirty') // UI に出さない
    .map((key) => {
    if (key === 'tag') {
      return {
        key: narrow('tag'),
        name: JP_NAME.tag,
        width: 140,
        editable: (row) =>
          allowEditRegistered || !row.tag || row.isRegistered === false,
        renderEditCell: (p: RenderEditCellProps<TransactionRow>) => (
          <TagSelectEditor {...p} />
        ),
        renderCell: TagCellFormatter,
      } satisfies Column<TransactionRow>;
    }

    return {
      key: narrow(key),
      name: JP_NAME[key],
      resizable: false,
      width: 110,
    } satisfies Column<TransactionRow>;
  });
}
