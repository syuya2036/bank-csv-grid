// Path: src/utils/exporter.ts
import type { BankCode } from '@/types/bank';
import type { TransactionRow } from '@/types/transaction';

import { toCsvPayPay, BANK_CODE as paypay } from '@/converters/paypay';
import { BANK_CODE as gmo } from '@/converters/gmo';
import { BANK_CODE as sbi } from '@/converters/sbi';


/**
 * 銀行別 CSV 生成
 * @param bank    銀行コード
 * @param rows    変換済み行
 * @param options headers: 1 行目を任意のヘッダー配列で上書き
 */
interface CsvOptions { headers?: string[] }

/** 共通シンプル CSV 生成  
 *  `options.headers` を与えると 1 行目を書き換えられる */
export function toCsv(
  _bank: BankCode,
  rows : TransactionRow[],
  options: { headers?: string[] } = {}
): string {
  const headers =
    options.headers ??
    ['ID', '銀行', '日付', '適用', '入金', '出金', '残高', 'メモ'];

  const body = rows
    .map(r =>
      [
        r.id,
        r.bank,
        r.date,
        r.description,
        r.credit,
        r.debit,
        r.balance,
        r.memo ?? ''
      ].join(',')
    )
    .join('\n');

  return [headers.join(','), body].join('\n');
}