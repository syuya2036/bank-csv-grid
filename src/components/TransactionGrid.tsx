
// --- src/components/TransactionGrid.tsx ---
'use client'
import React from 'react'
import { DataGrid, RowsChangeData } from 'react-data-grid'
import { buildColumns, GridKey } from '@/utils/columns'
import type { TransactionRow } from '@/types/transaction'
import { defaultColumnOptions } from '@/utils/gridDefaults'

type Props = {
  rows: TransactionRow[]
  onRowsChange: (rows: TransactionRow[]) => void
}

export default function TransactionGrid({ rows, onRowsChange }: Props) {
  if (!rows.length) return <p>データがありません</p>

  const columns = buildColumns(Object.keys(rows[0]) as GridKey[])

  function handleRowsChange(updated: TransactionRow[]) {
    onRowsChange(updated)
  }

  return (
    <div className="w-full h-[600px]">
      <DataGrid<TransactionRow>
        columns={columns}
        rows={rows}
        rowKeyGetter={(r) => r.id}
        onRowsChange={handleRowsChange}
        defaultColumnOptions={defaultColumnOptions}
      />
    </div>
  )
}