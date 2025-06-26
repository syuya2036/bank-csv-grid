// src/app/api/transactions/bulk-tag/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * 取引行の tag をまとめて更新する PATCH エンドポイント
 * 受信ボディ: [{ id: string; tag?: string }, ...]
 */
export async function PATCH(request: Request) {
  const rows: { id: string; tag?: string }[] = await request.json();

  // トランザクションで一括更新
  await prisma.$transaction(
    rows.map(({ id, tag }) =>
      prisma.transaction.update({
        where: { id },
        data : { tag },
      })
    )
  );

  return NextResponse.json({ updated: rows.length });
}
