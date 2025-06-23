import React, { useState, useEffect } from 'react'
import type { Column } from 'react-data-grid'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { useTagOptions } from '@/hooks/useTagOptions'
import type { TransactionRow } from '@/types/transaction'

/** TagSelectEditor 用 Props 型 */
interface TagSelectEditorProps {
  row: TransactionRow
  column: Column<TransactionRow, any>
  onRowChange: (r: TransactionRow) => void
  closeEditor: () => void
}

export default function TagSelectEditor({
  row,
  column,
  onRowChange,
  closeEditor,
}: TagSelectEditorProps) {
  const options = useTagOptions()
  const [value, setValue] = useState<string>(row.tag ?? '')

  // 外部で row.tag が変われば追従
  useEffect(() => setValue(row.tag ?? ''), [row.tag])

  // 選択時に即コミット & エディタ閉じ
  const handleSelect = (v: string) => {
    const updated = { ...row, tag: v }
    onRowChange(updated)
    closeEditor()
  }

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
        {/* 必要に応じて追加 */}
      </SelectContent>
    </Select>
  )
}
