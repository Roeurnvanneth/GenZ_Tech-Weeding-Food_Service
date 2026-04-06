import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// ១. កំណត់ Path ទៅរក file .env ឱ្យច្បាស់
dotenv.config({ path: path.join(__dirname, '../.env') });

// ២. បង្កើត PrismaClient ដោយហុច URL ចូលទៅក្នុង Constructor ផ្ទាល់
// នេះជួយឱ្យបាត់ Error "needs to be constructed with a non-empty..."
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
} as any); // ប្រើ 'as any' ដើម្បីកុំឱ្យ TypeScript រករឿងរឿង datasources

async function main() {
  console.log("🚀 កំពុងចាប់ផ្ដើមដាក់ទិន្នន័យ Seed...");

  // សម្អាតទិន្នន័យចាស់
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // បង្កើត Categories
  const categoriesData = [
    { name: "អាពាហ៍ពិពាហ៍", slug: "wedding", desc: "សេវាកម្មអាពាហ៍ពិពាហ៍" },
    { name: "ពិធីបុណ្យទាន", slug: "ceremony", desc: "សម្រាប់បុណ្យបច្ច័យបួន ឬបុណ្យផ្ទះ" },
    { name: "សេវាកម្មរោង", slug: "tent", desc: "ការជួលរោង និងតុការ" },
    { name: "ខួបកំណើត", slug: "birthday", desc: "ការរៀបចំកម្មវិធីខួបកំណើត" },
    { name: "កម្មវិធីក្រុមហ៊ុន", slug: "corporate", desc: "សម្រាប់ពិធីជប់លៀងក្រុមហ៊ុន" },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.desc,
        translations: {},
        isPoppular: true,
      },
    });
    categories.push(createdCat);
  }

  const [wedding, ceremony, tent, birthday, corporate] = categories;

  // បង្កើត Products (២០ មុខ)
  const productsData = [
    { title: "គ្រាប់ស្វាយចន្ទីលីង", price: 15, catId: wedding.id, slug: "cashew-nuts" },
    { title: "ញាំមាន់ត្រយូងចេក", price: 22, catId: wedding.id, slug: "chicken-salad" },
    { title: "ត្រីដុតទឹកត្រីជូរអែម", price: 35, catId: wedding.id, slug: "grilled-fish" },
    { title: "ស៊ុបមីសួរគ្រឿងសមុទ្រ", price: 30, catId: wedding.id, slug: "seafood-soup" },
    { title: "បង្កងដុតហ្វ័រម៉ាត", price: 65, catId: wedding.id, slug: "lobster-cheese" },
    { title: "អាម៉ុកត្រីសាច់ដុំ", price: 20, catId: ceremony.id, slug: "fish-amok" },
    { title: "ការីសាច់មាន់នំបុ័ង", price: 25, catId: ceremony.id, slug: "chicken-curry" },
    { title: "ខសាច់ជ្រូកពងទា", price: 18, catId: ceremony.id, slug: "pork-stew" },
    { title: "ឆាគ្រឿងសមុទ្រម្រេចខ្ចី", price: 28, catId: ceremony.id, slug: "stir-fry-pepper" },
    { title: "រោងការម៉ូដថ្មី", price: 450, catId: tent.id, slug: "modern-tent" },
    { title: "រោងបុណ្យបែបសាមញ្ញ", price: 250, catId: tent.id, slug: "simple-tent" },
    { title: "ជួលតុការ (១តុ)", price: 15, catId: tent.id, slug: "table-rental" },
    { title: "ម៉ាស៊ីនត្រជាក់ចល័ត", price: 80, catId: tent.id, slug: "portable-ac" },
    { title: "ភីហ្សាសាច់ក្រក", price: 18, catId: birthday.id, slug: "pizza-sausage" },
    { title: "ស្លាបមាន់បំពងទឹកឃ្មុំ", price: 12, catId: birthday.id, slug: "fried-chicken" },
    { title: "នំខេកខួបកំណើត", price: 45, catId: birthday.id, slug: "birthday-cake" },
    { title: "តុបតែងប៉េងប៉ោង", price: 120, catId: birthday.id, slug: "balloon-decor" },
    { title: "អាហារសម្រន់ Buffet", price: 15, catId: corporate.id, slug: "buffet-snack" },
    { title: "ឈុតបាយប្រអប់ VIP", price: 8, catId: corporate.id, slug: "vip-lunch" },
    { title: "សេវាកម្មតន្ត្រី", price: 200, catId: corporate.id, slug: "sound-system" },
  ];

  for (const p of productsData) {
    await prisma.product.create({
      data: {
        title: p.title,
        price: p.price,
        categoryId: p.catId,
        slug: p.slug,
        images: [`https://placehold.co/600x400?text=${p.slug}`],
        translations: {},
        isPoppular: true,
      },
    });
  }

  console.log("✅ Seed ជោគជ័យ៖ បានបង្កើត ៥ Categories និង ២០ Products!");
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });