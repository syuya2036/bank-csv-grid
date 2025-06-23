import { type Column } from 'react-data-grid';
import { type TransactionRow } from '@/types/transaction'; 
/** カラムキーのユニオン */
export type GridKey = keyof TransactionRow; 
// 例: 'id' | 'bank' | 'date' | 'description' | 'credit' | 'debit' | 'balance' | 'memo'

/** 列定義テンプレート */
export interface ColumnDef {
  /** DataGrid に渡すラベル */
  name: string;
  /** 各種オプションのオーバーライドがあればここで */
  // 例: width?: number;
}

/** buildColumns の戻り型 */
export function buildColumns(keys: GridKey[]): Column<TransactionRow, GridKey>[] {
  const template: Record<GridKey, ColumnDef> = {
    id: { name: 'ID' },
    bank: { name: '銀行' },
    date: { name: '日付' },
    description: { name: '摘要' },
    credit: { name: '入金' },
    debit: { name: '出金' },
    balance: { name: '残高' },
    memo: { name: 'メモ' },
    tag:         { name: 'タグ' }
  };
  return keys.map((key) => ({
    ...template[key],
    key,
    name: template[key].name,
  }));
}
