/* path: src/converters/index.ts */
import type { BankCode } from '@/types/bank';
import type { TransactionRow } from '@/types/transaction';

import { convertPaypay,  BANK_CODE as paypay } from './paypay';
import { convertGmo,     BANK_CODE as gmo    } from './gmo';
import { convertSbi,     BANK_CODE as sbi    } from './sbi';
import { convertMizuhoEbiz,     BANK_CODE as mizuhoebiz    } from './mizuho-ebiz';
import { convertMizuhoBizweb, BANK_CODE as mizuhobizweb } from './mizuho-bizweb';

export type Converter = (raw: Record<string, string>) => TransactionRow;

export const registry = {
  [paypay]: convertPaypay,
  [gmo]:    convertGmo,
  [sbi]:    convertSbi,
  [mizuhoebiz]: convertMizuhoEbiz,
  [mizuhobizweb]: convertMizuhoBizweb   
} as Record<BankCode, Converter>;

export { BankCode }; // <-- 他所で誤 import されても型が流れるよう輸出
