// src/app/api/export/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toCsv } from '@/utils/exporter';
import type { TransactionRow } from '@/types/transaction';
import type { BankCode } from '@/types/bank';

export async function GET(request: Request) {
  // nextUrl ではなく URL
  const { searchParams } = new URL(request.url);
  const bankParam = searchParams.get('bank') ?? '';
  const bank = bankParam as BankCode;

  // TransactionRow の形に合う列だけ select
  const dbRows = await prisma.transaction.findMany({
    where: { bank },
    select: {
      id:          true,
      bank:        true,
      date:        true,
      description: true,
      credit:      true,
      debit:       true,
      balance:     true,
      memo:        true,
      tag:         true,
    },
  });
  const data: TransactionRow[] = dbRows.map(r => ({
    id:          r.id,
    bank:        r.bank as BankCode,
    date:        r.date.toISOString().slice(0,10).replace(/-/g,'/'),
    description: r.description,
    credit:      r.credit,
    debit:       r.debit,
    balance:     r.balance  ?? 0,
    memo:        r.memo     ?? '',
    tag:         r.tag      ?? '',
    isRegistered: true,
  }));

  const csv = toCsv(bank, data, {
    headers: ['取引日','内容','入金','出金','残高','メモ','タグ'],
  });

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type':        'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${bank}-export.csv"`,
    },
  });
}
