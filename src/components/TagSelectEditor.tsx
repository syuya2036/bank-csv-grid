import React, { useState, useEffect } from 'react';
import type { Column, RenderEditCellProps } from 'react-data-grid';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useTagOptions } from '@/hooks/useTagOptions';
import type { TransactionRow } from '@/types/transaction';

/**
 * タグを編集するセルエディタ
 * react-data-grid の RenderEditCellProps をそのまま使う。
 */
export default function TagSelectEditor({
  row,
  column,
  onRowChange,
  onClose,
}: RenderEditCellProps<TransactionRow, unknown>) {
  const options = useTagOptions();
  const [value, setValue] = useState<string>(row.tag ?? '');

  /* 外部更新に追従 */
  useEffect(() => setValue(row.tag ?? ''), [row.tag]);

  /* 選択時に即コミットしてエディタを閉じる */
  const handleSelect = (v: string) => {
    onRowChange({ ...row, tag: v });
    onClose();
  };

  return (
    <Select value={value} onValueChange={handleSelect}>
      <SelectTrigger autoFocus>
        <SelectValue placeholder="タグを選択" />
      </SelectTrigger>
      <SelectContent>
        {options.map(opt => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
