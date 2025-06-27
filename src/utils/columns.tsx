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
      let style = 'bg-gray-200 text-gray-500'; // 未割当(灰)
  let label = '未割当';

  if (row.tag) {
    label = row.tag;
    style = row.isRegistered
      ? 'bg-green-100 text-green-800'   // 登録済み → 緑
      : 'bg-yellow-100 text-yellow-800';// 未登録だが割当済 → 黄
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
                /**
         * 「未割当セルはいつでも編集可」
         *   ・tag が undefined / '' ⇒ true
         *   ・登録済みでも未割当なら編集可
         *   ・登録済みかつ割当済みならロック
         */
        editable: (row) => !row.tag || row.isRegistered === false,
        //editable: ( row ) => !row.isRegistered,
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