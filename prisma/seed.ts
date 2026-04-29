import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  console.log("🚀 កំពុងចាប់ផ្ដើម Seed គណនី Admin...");

  // បង្កើត Admin User
  const admin = await prisma.user.create({
    data: {
      name: "Roeurn Vanneth",
      phone: "012345678",
      role: "ADMIN", // កំណត់តួនាទីជា Admin
    },
  });

  console.log(`✅ បានបង្កើត Admin រួចរាល់: ${admin.name} (${admin.phone})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());