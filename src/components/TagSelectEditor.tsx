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

export default function TagSelectEditor({
  row,
  rowIdx,
  column,
  onRowChange,
  onClose,
}: EditorProps<TransactionRow>) {
  const options = useTagOptions();
  const EMPTY = UNASSIGNED_TAG;

  function handleSelect(v: string) {
    const newTag = v === EMPTY ? undefined : v;
    if (row.tag !== newTag) {
      onRowChange({ ...row, tag: newTag });
    }
    setTimeout(onClose, 0); // 編集確定の競合回避
  }

  return (
    <Select value={row.tag ?? EMPTY} onValueChange={handleSelect}>
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
