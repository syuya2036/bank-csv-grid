/* eslint-disable react/jsx-no-bind */
'use client';

import React from 'react';
import type { EditorProps } from '@/types/react-data-grid';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { useTagOptions } from '@/hooks/useTagOptions';
import { UNASSIGNED_TAG } from '@/constants/tags';
import type { TransactionRow } from '@/types/transaction';
const EMPTY = UNASSIGNED_TAG;

/**
 * タグ編集用エディタコンポーネント
 * - EditorProps<T> 自作型を使用
 */
export default function TagSelectEditor({
  row,
  rowIdx,
  column,
  onRowChange,
  onClose,
}: EditorProps<TransactionRow>) {
  const options = useTagOptions();

  /** 選択時に即コミット＆閉じる */

  function handleSelect(v: string) {
    const newTag = v === EMPTY ? undefined : v;
    if (row.tag !== newTag) {
      // 第二引数 true で “確定” 扱いに
      onRowChange({ ...row, tag: newTag }, true);
    }
    setTimeout(onClose, 0);
  }

  return (
    <Select
      value={row.tag ?? UNASSIGNED_TAG}
      onValueChange={handleSelect}
      open={true}
      onOpenChange={(isOpen) => {
        // ドロップダウンが閉じたらエディタも閉じる
        if (!isOpen) onClose();
      }}
    >
      <SelectTrigger autoFocus>
        <SelectValue placeholder="タグを選択" />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
