import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  console.log("🚀 កំពុងចាប់ផ្ដើម Seed ទិន្នន័យគ្រប់តារាង...");

  // ១. សម្អាតទិន្នន័យ (តាមលំដាប់លុបដើម្បីចៀសវាង Constraint Error)
  await prisma.bookingItem.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.cateringItem.deleteMany({});
  await prisma.catering.deleteMany({});
  await prisma.cateringStandard.deleteMany({});
  await prisma.menuPricing.deleteMany({});
  await prisma.menu.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.eventType.deleteMany({});
  await prisma.teamMember.deleteMany({});
  await prisma.user.deleteMany({});

  // ២. បង្កើត Master Data
  const catFood = await prisma.category.create({ 
    data: { name: "ម្ហូបខ្មែរ", slug: "khmer-food", translations: { kh: "ម្ហូបខ្មែរ" } } 
  });
  const catDecor = await prisma.category.create({ 
    data: { name: "សម្ភារៈដេគ័រ", slug: "decor", translations: { kh: "សម្ភារៈដេគ័រ" } } 
  });

  const evWedding = await prisma.eventType.create({ data: { name: "Wedding" } });
  const stdGold = await prisma.cateringStandard.create({ data: { name: "Gold Standard" } });

  // ៣. បង្កើត Menu & Pricings
  const menu1 = await prisma.menu.create({
    data: {
      menu_name: "ស៊ុបទាកាប៉ា",
      categoryId: catFood.id,
      pricings: { create: { price: 15.00, price_usd: 15.00, price_khr: 60000, status: "active" } }
    },
    include: { pricings: true }
  });

  // ៤. បង្កើត Products & Team
  await prisma.product.create({
    data: { title: "កៅអី VIP", slug: "vip-chair", price: 5, categoryId: catDecor.id, images: {}, translations: {} }
  });

  await prisma.teamMember.create({
    data: { slug: "chef-dara", image: "dara.jpg", translations: { kh: { name: "ចុងភៅ ដារ៉ា" } } }
  });

  // ៥. បង្កើត Catering Package
  const weddingPackage = await prisma.catering.create({
    data: {
      name: "Luxury Wedding Package",
      description: "ឈុតម្ហូបសម្រាប់រៀបការលំដាប់ខ្ពស់",
      totalPrice: 1500.00,
      cateringStandardId: stdGold.id,
      eventTypeId: evWedding.id,
      items: {
        create: [{ menuId: menu1.id, eventTypeId: evWedding.id }]
      }
    }
  });

  // ៦. បង្កើត User & Booking
  const user = await prisma.user.create({ 
    data: { name: "Sok Dara", phone: "012345678", role: "USER" } 
  });

  await prisma.booking.create({
    data: {
      customerName: "លោក វណ្ណៈ",
      phoneNumber: "010000000",
      userId: user.id,
      programDate: new Date(),
      event_date: new Date(),
      location: "Phnom Penh",
      guestCount: 200,
      totalPrice: 1500.00,
      catering_id: weddingPackage.id,
      bookingItems: {
        create: [{ 
          menu_pricing_id: menu1.pricings[0].id, 
          quantity: 20, 
          price: 15.00 
        }]
      }
    }
  });

  console.log("✅ Seed ទិន្នន័យបានជោគជ័យគ្រប់តារាង!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());