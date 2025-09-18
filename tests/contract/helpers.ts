import { prisma } from '@/lib/prisma';

export async function resetDb() {
	await prisma.tagAssignment?.deleteMany?.({}).catch(() => { });
	await prisma.tag.deleteMany({});
	await prisma.transaction.deleteMany({});
}

export function checkTagShape(obj: any) {
	expect(typeof obj.id).toBe('string');
	expect(typeof obj.name).toBe('string');
	// createdAt/updatedAt は API が Date を ISO 文字列化するか実装次第なので存在のみチェック
	expect(obj.createdAt).toBeTruthy();
	expect(obj.updatedAt).toBeTruthy();
}
