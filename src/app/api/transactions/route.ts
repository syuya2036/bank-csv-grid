// src/app/api/transactions/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { TransactionRow } from '@/types/transaction';
import type { BankCode } from '@/types/bank';

export async function GET(request: Request) {
  // Next.js App Router の Web API Request では nextUrl は使えないので
  // URL コンストラクタで searchParams を取得
  const { searchParams } = new URL(request.url);
  const bankParam = searchParams.get('bank') ?? '';
  const bank = bankParam as BankCode;

  // 必要なフィールドだけ select
  const rows = await prisma.transaction.findMany({
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
    orderBy: { date: 'desc' },
  });

  // Prisma の Date → YYYY/MM/DD 文字列に変換しつつ
  // TransactionRow 形にマッピング
  const formatted: TransactionRow[] = rows.map(r => ({
    id:          r.id,
    bank:        r.bank as BankCode,
    date:        r.date.toISOString().slice(0,10).replace(/-/g,'/'),
    description: r.description,
    credit:      r.credit,
    debit:       r.debit,
    balance:     r.balance  ?? 0,
    memo:        r.memo     ?? '',
    tag:         r.tag      ?? '',
  }));

  return NextResponse.json(formatted);
}
