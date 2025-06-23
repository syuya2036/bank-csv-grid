// src/components/TransactionGrid.tsx
'use client';
import {
  DataGrid,
  type Column
} from 'react-data-grid';
import type { TransactionRow } from '@/types/transaction';
import { useState } from 'react';
import { buildColumns, type GridKey } from '@/utils/columns';
import { defaultColumnOptions } from '@/utils/gridDefaults';
import type { DefaultColumnOptions } from 'react-data-grid';
import React, { useMemo } from 'react';
import { calcSummary, type SummaryRow } from '@/utils/summary';

interface Props {
  rows: TransactionRow[];
  onRowsChange(r: TransactionRow[]): void;
}

export default function TransactionGrid({ rows, onRowsChange }: Props) {
  /** グリッドに出したい列（表示順） */
  const visible: GridKey[] = ['id','bank','date','description','credit','debit','balance','memo'];
  const columns = useMemo(() => buildColumns(visible), [visible]);

  /** 幅 0 で消えるのを防ぐ共通設定 */
  const defaultCol: DefaultColumnOptions<TransactionRow, unknown> = {
    resizable: true,
    width: 110
  };

  return (
    <DataGrid<TransactionRow | SummaryRow, unknown, string>
      className="rdg-light h-[600px] overflow-x-auto"
      columns={columns as Column<any>[]}
      rows={rows}
      onRowsChange={(updated, _d) => onRowsChange(updated as TransactionRow[])}
      rowKeyGetter={(r: TransactionRow) => r.id}
      defaultColumnOptions={defaultColumnOptions}
      
      bottomSummaryRows={[calcSummary(rows)]}
    />
  );
}
