// src/utils/exporter.ts
import type { BankCode }       from '@/types/bank';
import type { TransactionRow } from '@/types/transaction';

interface CsvOptions { headers?: string[] }

/**
 * 共通 CSV 生成
 * - headers が 8 列なら id/bank 付き
 * - それ以外は id/bank を除外
 */
function defaultCsv(rows: TransactionRow[], headers: string[]): string {
  const includeMeta = headers.length === 8;

  const body = rows
    .map(r => {
      const main = [
        r.date,
        r.description,
        r.credit,
        r.debit,
        r.balance ?? '',
        r.memo    ?? ''
      ];
      return includeMeta
        ? [r.id, r.bank, ...main].join(',')
        : main.join(',');
    })
    .join('\n');

  return [headers.join(','), body].join('\n');
}

/** 銀行別 CSV 生成（当面は共通ロジックでカバー） */
export function toCsv(
  _bank: BankCode,
  rows : TransactionRow[],
  opts : CsvOptions = {}
): string {
  const headers = opts.headers ??
    ['ID','銀行','取引日','内容','入金','出金','残高','メモ'];

  return defaultCsv(rows, headers);
}
