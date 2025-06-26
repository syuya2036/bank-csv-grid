// src/app/api/tags/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/tags: 全Tag取得
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(tags);
    } catch (error) {
    console.error('[API /tags GET]', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}


// POST /api/tags: 新規追加（nameのみ必須）
export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Tag name required' }, { status: 400 });
    }
    // 重複チェック（nameユニーク前提で）
    const exists = await prisma.tag.findFirst({ where: { name } });
    if (exists) {
      return NextResponse.json({ error: 'Tag name already exists' }, { status: 409 });
    }
    const tag = await prisma.tag.create({ data: { name } });
    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
  console.error('[API /tags POST]', error); // または PATCH/GET用
  return NextResponse.json({ error: String(error) }, { status: 500 });
}

}

// PATCH /api/tags: idで編集
export async function PATCH(req: NextRequest) {
  try {
    const { id, name } = await req.json();
    if (!id || !name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Tag id and name required' }, { status: 400 });
    }
    // idの存在確認
    const exists = await prisma.tag.findUnique({ where: { id } });
    if (!exists) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }
    // 重複名チェック（編集先が同じnameの場合以外）
    const dup = await prisma.tag.findFirst({ where: { name, NOT: { id } } });
    if (dup) {
      return NextResponse.json({ error: 'Tag name already exists' }, { status: 409 });
    }
    const tag = await prisma.tag.update({ where: { id }, data: { name } });
    return NextResponse.json(tag);
  } catch (error) {
  console.error('[API /tags PATCH]', error); // または PATCH/GET用
  return NextResponse.json({ error: String(error) }, { status: 500 });
}

}
