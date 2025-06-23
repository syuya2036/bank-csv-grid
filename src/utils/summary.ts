// src/utils/summary.ts
import type { Column } from 'react-data-grid';
import type { TransactionRow } from '@/types/transaction';

/** カンマ区切りフォーマッタ（0 → ''） */
const yenFmt = (v?: number) => (v ? v.toLocaleString('ja-JP') : '');

const header: Record<keyof TransactionRow, string> = {
  id: 'ID',
  bank: '銀行',
  date: '日付',
  description: '摘要',
  credit: '入金',
  debit: '出金',
  balance: '残高',
  memo: 'メモ',
  tag:         'タグ'
};

/**
 * 列定義を生成する
 * @param keys 表示したいフィールド。省略時は主要列を表示
 */
export function buildColumns(
  keys: (keyof TransactionRow)[] = [
    'date',
    'description',
    'credit',
    'debit',
    'balance',
    'memo',
    'tag'
  ]
): Column<TransactionRow, unknown>[] {
  return keys.map((k): Column<TransactionRow> => {
    const base = { key: k, name: header[k] };

    if (k === 'credit' || k === 'debit' || k === 'balance') {
      return {
        ...base,
        renderCell: ({ row }) => yenFmt(row[k])
      };
    }
    return base;
  });
}

/** TransactionRow 全キーを持つサマリー型 */
/** サマリー行も TransactionRow と同じ型を持つ */
export interface SummaryRow extends TransactionRow {
  /** 固定 ID */
  id: '__summary__';
  /** 固定表示文字 */
  description: '合計';
  // bank/date/memo/balance 等は親の TransactionRow 定義に従う
}

/** 合計行を生成 */
export function calcSummary(rows: TransactionRow[]): SummaryRow {
  const credit = rows.reduce((sum, r) => sum + r.credit, 0);
  const debit = rows.reduce((sum, r) => sum + r.debit, 0);
  // 先頭行の bank をそのまま継承（BankCode 型なので型エラーなし）
  const bank = rows[0]?.bank;
  return {
    id: '__summary__',
    bank,
    date: '',
    description: '合計',
    credit,
    debit,
    balance: 0,
    memo: '',
    tag:''
  };
}
