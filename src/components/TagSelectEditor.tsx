// src/components/TagSelectEditor.tsx:1-63
/* eslint-disable react/jsx-no-bind */
'use client';

import React from 'react';
import type { RenderEditCellProps } from 'react-data-grid';
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

export default function TagSelectEditor({
  row,
  onRowChange,
  onClose,
}: RenderEditCellProps<TransactionRow>) {
  const options = useTagOptions();

  function handleSelect(v: string) {
    const newTag = v === EMPTY ? undefined : v;
    if (row.tag !== newTag) {
      onRowChange({ ...row, tag: newTag, isDirty: true }, true);
    }
    setTimeout(onClose, 0);
  }

  return (
    <Select
      value={row.tag ?? UNASSIGNED_TAG}
      onValueChange={handleSelect}
      open={true}
      onOpenChange={(isOpen) => !isOpen && onClose()}
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
