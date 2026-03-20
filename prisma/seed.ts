import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  const admin = await prisma.user.create({
    data: { name: 'Admin', phone: '012345678', role: 'ADMIN' },
  });
  console.log('✅ Admin seeded:', admin);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());