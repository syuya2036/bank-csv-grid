import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 例示: 科目（SUBJECT）とKPI（KPI）を投入
  const subjects = ['収入', '費用', '内部経費'];
  const kpis = ['顧客数', '単価'];

  // SUBJECTをルートに
  for (const name of subjects) {
    const exists = await prisma.tag.findFirst({ where: { name } });
    if (!exists) {
      await prisma.tag.create({ data: { name, type: 'SUBJECT' } });
    }
  }

  // KPIはルート直下に（実運用では親SUBJECT配下に配置する）
  for (const name of kpis) {
    const exists = await prisma.tag.findFirst({ where: { name } });
    if (!exists) {
      await prisma.tag.create({ data: { name, type: 'KPI' } });
    }
  }

  console.log('Seeded Tag table with SUBJECT and KPI examples');
}

main()
  .then(() => {
    console.log('Seed completed');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
