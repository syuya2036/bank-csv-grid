// --- src/utils/columns.tsx ---
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
  const isAssigned = !!row.tag;
  const style = isAssigned
    ? row.id.startsWith('tmp-')
      ? 'bg-green-100 text-green-800' // 新規行でタグ決定→緑
      : 'bg-gray-200 text-gray-500'   // DB 済みでタグ決定→グレー
    : 'bg-red-100 text-red-600';      // タグ未設定→赤

  const label = isAssigned ? row.tag : '未割当';

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
} as const;

// narrow helper
function narrow<K extends GridKey>(k: K): K {
  return k;
}

export function buildColumns(keys: GridKey[]): Column<TransactionRow>[] {
  return keys.map((key) => {
    if (key === 'tag') {
      return {
        key: narrow('tag'), // keyof TransactionRow リテラルを保証
        name: JP_NAME.tag,
        width: 140,
        editable: (r) => !r.isRegistered,
        renderEditCell: (p: RenderEditCellProps<TransactionRow>) => (
          <TagSelectEditor {...p} />
        ),
        renderCell: TagCellFormatter
      } satisfies Column<TransactionRow>;
    }

    return {
      key: narrow(key),
      name: JP_NAME[key],
      resizable: false,
      width: 110
    } satisfies Column<TransactionRow>;
  });
}