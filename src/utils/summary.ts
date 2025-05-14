// src/utils/summary.ts
import type { Column } from 'react-data-grid';
import type { TransactionRow } from '@/types/transaction';

/** 数値 → カンマ区切り，日本語ロケール。0 は空文字列で返す */
const yenFmt = (v?: number) => (v ? v.toLocaleString('ja-JP') : '');

/** DataGrid に表示するカラム鍵（bank だけ除外） */
type GridKey = Exclude<keyof TransactionRow, 'bank'>;

/**
 * 表示したい列順を `keys` で受け取り、
 * `react-data-grid` の Column 配列に組み立てる。
 * 引数を省略した場合は共通 6 列を返す。
 */
export function buildColumns(
  keys: GridKey[] = [
    'date',
    'description',
    'credit',
    'debit',
    'balance',
    'memo'
  ]
): Column<TransactionRow, unknown>[] {
  const header: Record<GridKey, string> = {
    id: 'ID',
    date: '日付',
    description: '適用',
    credit: '入金',
    debit: '出金',
    balance: '残高',
    memo: 'メモ'
  };

  return keys.map((k): Column<TransactionRow> => {
    const base = { key: k, name: header[k] };

    if (['credit', 'debit', 'balance'].includes(k)) {
      return {
        ...base,
        /** 数値列はフォーマッタを適用 */
        renderCell: ({ row }) => yenFmt(row[k as 'credit' | 'debit' | 'balance'])
      };
    }
    return base;
  });
}

/** 合計計算（入金・出金のみ） */
export function calcSummary(rows: TransactionRow[]) {
  return rows.reduce(
    (acc, r) => {
      acc.credit += r.credit;
      acc.debit += r.debit;
      return acc;
    },
    { credit: 0, debit: 0 }
  );
}
