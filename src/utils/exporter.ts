// Path: src/utils/exporter.ts
import type { BankCode } from '@/types/bank';
import type { TransactionRow } from '@/types/transaction';

import { toCsvPayPay, BANK_CODE as paypay } from '@/converters/paypay';
import { toCsvGmo,    BANK_CODE as gmo    } from '@/converters/gmo';
import { toCsvSbi,    BANK_CODE as sbi    } from '@/converters/sbi';

const delegates: Record<BankCode, (r: TransactionRow[]) => string> = {
  [paypay]: toCsvPayPay,
  [gmo]:    toCsvGmo,
  [sbi]:    toCsvSbi
};

/** 銀行別 CSV 生成 */
export function toCsv(bank: BankCode, rows: TransactionRow[]): string {
  return delegates[bank](rows);
}
