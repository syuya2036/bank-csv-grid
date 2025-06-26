import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { tag } = await request.json();
  const updated = await prisma.transaction.update({
    where: { id: params.id },
    data : { tag },
  });
  return NextResponse.json(updated);
}
