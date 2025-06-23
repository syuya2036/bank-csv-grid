// src/utils/buildColumns.ts
import type { Column } from 'react-data-grid';
import type { TransactionRow } from '@/types/transaction';
import TagSelectEditor from '@/components/TagSelectEditor';
import { formatYen } from '@/utils/formatYen';

export function buildColumns(): Column<TransactionRow>[] {
  return [
    { key:'date',        name:'取引日',       resizable:true },
    { key:'description', name:'内容',         resizable:true },
    { key:'credit',      name:'入金',   formatter:({row})=>formatYen(row.credit),   resizable:true },
    { key:'debit',       name:'出金',   formatter:({row})=>formatYen(row.debit),    resizable:true },
    { key:'balance',     name:'残高',   formatter:({row})=>row.balance!=null?formatYen(row.balance):'', resizable:true },
    { key:'memo',        name:'メモ',         resizable:true },
    {
      key:      'tag',
      name:     'タグ',
      editable: true,
      editor:   TagSelectEditor,
      width:    120,
    },
  ];
}
