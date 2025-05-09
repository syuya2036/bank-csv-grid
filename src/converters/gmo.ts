/* path: src/converters/gmo.ts */
import { nanoid } from 'nanoid';
import { parseISO, format } from 'date-fns';
import { TransactionRow } from '../types/transaction';
import { z } from 'zod';

export const BANK_CODE = 'gmo' as const;

const RawSchema = z.object({
  日付: z.string(),
  摘要: z.string(),
  入金額: z.string().optional(),
  出金額: z.string().optional(),
  残高: z.string().optional()
});

export function convertGmo(raw: Record<string, string>): TransactionRow {
  const data = RawSchema.parse(raw);

  const date = format(parseISO(data['日付'].replace(/\./g, '-')), 'yyyy-MM-dd');
  const credit = +data['入金額']!.replace(/,/g, '') || 0;
  const debit = +data['出金額']!.replace(/,/g, '') || 0;

  return {
    id: nanoid(),
    bank: BANK_CODE,
    date,
    description: data['摘要'],
    credit,
    debit,
    balance: data['残高'] ? +data['残高'].replace(/,/g, '') : undefined
  };
}

export function toCsv(rows: TransactionRow[]): string {
  const header = ['日付', '摘要', '入金額', '出金額', '残高'].join(',');
  const body = rows
    .filter(r => r.bank === BANK_CODE)
    .map(r =>
      [
        r.date,
        r.description,
        r.credit || '',
        r.debit || '',
        r.balance ?? ''
      ].join(',')
    )
    .join('\n');
  return `${header}\n${body}`;
}


export function toCsvGmo(rows: TransactionRow[]): string {
  const header = ['日付', '摘要', '入金額', '出金額', '残高'].join(',');
  const body = rows
    .filter(r => r.bank === BANK_CODE)
    .map(r =>
      [
        r.date,
        r.description,
        r.credit || '',
        r.debit || '',
        r.balance ?? ''
      ].join(',')
    )
    .join('\n');
  return `${header}\n${body}`;
}