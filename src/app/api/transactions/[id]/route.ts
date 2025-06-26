import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // Promise 化
) {
    const { id } = await params;             // ← await が必須
  const { tag } = await req.json();

  const updated = await prisma.transaction.update({
    where: { id },
    data : { tag },
  });

  return NextResponse.json(updated);
}
