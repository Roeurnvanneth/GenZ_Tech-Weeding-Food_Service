import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  console.log("🚀 កំពុងចាប់ផ្ដើមដាក់ទិន្នន័យ Seed ចំនួនច្រើន...");

  // ១. សម្អាតទិន្នន័យចាស់
  await prisma.bookingItem.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.cateringItem.deleteMany({});
  await prisma.catering.deleteMany({});
  await prisma.menuPricing.deleteMany({});
  await prisma.menu.deleteMany({});
  await prisma.cateringStandard.deleteMany({});
  await prisma.eventType.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.teamMember.deleteMany({});
  await prisma.user.deleteMany({});

  // ២. បង្កើត Categories ច្រើនជាងមុន
  console.log("📂 កំពុងបង្កើត Categories...");
  const catFood = await prisma.category.create({
    data: {
      name: "មុខម្ហូបខ្មែរ",
      slug: "khmer-food",
      isPoppular: true,
      translations: { kh: "មុខម្ហូបខ្មែរ", en: "Khmer Dishes" }
    }
  });

  const catAppetizer = await prisma.category.create({
    data: {
      name: "គ្រឿងក្លែម",
      slug: "appetizers",
      isPoppular: true,
      translations: { kh: "គ្រឿងក្លែម", en: "Appetizers" }
    }
  });

  const catEquipment = await prisma.category.create({
    data: {
      name: "សម្ភារៈដេគ័រ",
      slug: "decoration-items",
      isPoppular: true,
      translations: { kh: "សម្ភារៈដេគ័រ", en: "Decoration Items" }
    }
  });

  // ៣. បង្កើត Event Types & Standards
  const evWedding = await prisma.eventType.create({ data: { name: "អាពាហ៍ពិពាហ៍ (Wedding)" } });
  const evParty = await prisma.eventType.create({ data: { name: "ជប់លៀង (Party)" } });
  const stdGold = await prisma.cateringStandard.create({ data: { name: "Gold Standard" } });
  const stdSilver = await prisma.cateringStandard.create({ data: { name: "Silver Standard" } });

  // ៤. បង្កើត Menus ច្រើនមុខ (ដកស្រង់ចេញពីបញ្ជីម្ហូបពេញនិយម)
  console.log("🍽️ កំពុងបង្កើត Menus...");
  const menusData = [
    { name: "គ្រាប់ស្វាយចន្ទីលីង", price: 5, catId: catAppetizer.id },
    { name: "ញាំមាន់ត្រយូងចេក", price: 8, catId: catFood.id },
    { name: "ស៊ុបទាកាប៉ា", price: 15, catId: catFood.id },
    { name: "ត្រីដុតមើមជួយ", price: 12, catId: catFood.id },
    { name: "បង្គាបំពងខ្ទឹមស", price: 18, catId: catFood.id },
    { name: "ឡុកឡាក់សាច់គោ", price: 10, catId: catFood.id },
    { name: "បបរមឹក", price: 6, catId: catFood.id },
  ];

  const createdMenuIds: number[] = [];
  for (const m of menusData) {
    const menu = await prisma.menu.create({
      data: {
        menu_name: m.name,
        price_usd: m.price,
        price_khr: m.price * 4100,
        categoryId: m.catId,
        status: "active"
      }
    });
    createdMenuIds.push(menu.id);
  }

  // ៥. បង្កើត Catering Packages ចំនួន ២
  console.log("🍱 កំពុងបង្កើត Catering Packages...");
  const weddingPackage = await prisma.catering.create({
    data: {
      name: "Wedding Luxury Set A",
      catering_name: "ឈុតអាពាហ៍ពិពាហ៍កម្រិតមាស",
      event_name: "Wedding",
      description: "ឈុតម្ហូបពិសេស ៧ មុខសម្រាប់ការរៀបការ",
      total_price: 1500.00,
      catering_standard_id: stdGold.id,
      eventTypeId: evWedding.id,
      menuId: createdMenuIds.slice(0, 5) // យក ៥ មុខដំបូង
    }
  });

  const partyPackage = await prisma.catering.create({
    data: {
      name: "Standard Party Set",
      catering_name: "ឈុតជប់លៀងលក្ខណៈគ្រួសារ",
      event_name: "Party",
      description: "ម្ហូប ៤ មុខ សម្រាប់ជប់លៀងសាមញ្ញ",
      total_price: 800.00,
      catering_standard_id: stdSilver.id,
      eventTypeId: evParty.id,
      menuId: createdMenuIds.slice(4, 7) // យក ៣ មុខចុងក្រោយ
    }
  });

  // ៦. បង្កើត Products ច្រើនមុខ (Items)
  console.log("📦 កំពុងបង្កើត Products...");
  const products = [
    { title: "តុដេគ័របែបអឺរ៉ុប", slug: "euro-table", price: 25 },
    { title: "កៅអី VIP", slug: "vip-chair", price: 5 },
    { title: "ផ្កាស្រស់តុបតែងមុខរោង", slug: "fresh-flower-gate", price: 250 },
    { title: "ប្រព័ន្ធសំឡេងស្ដង់ដារ", slug: "sound-system", price: 120 },
    { title: "កម្រាលព្រំក្រហម (១០ម៉ែត្រ)", slug: "red-carpet", price: 30 },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        title: p.title,
        slug: p.slug,
        price: p.price,
        maxPrice: p.price + 10,
        hallPrice: p.price - 5,
        isPoppular: true,
        images: [`${p.slug}-1.jpg`, `${p.slug}-2.jpg`],
        translations: {
          kh: { title: p.title, desc: `សេវាកម្មជួល ${p.title} គុណភាពខ្ពស់` },
          en: { title: p.title.replace(/[^\x00-\x7F]/g, ""), desc: `High quality ${p.title} rental` }
        },
        categoryId: catEquipment.id
      }
    });
  }

  // ៧. បង្កើត Team Members ច្រើននាក់
  console.log("👥 កំពុងបង្កើត Team Members...");
  const team = [
    { slug: "sok-vichea", name: "សុខ វិជ្ជា", pos: "មេចុងភៅធំ", img: "vichea.jpg" },
    { slug: "keo-maly", name: "កែវ ម៉ាលី", pos: "អ្នកគ្រប់គ្រងកម្មវិធី", img: "maly.jpg" },
    { slug: "rath-samnang", name: "រ័ត្ន សំណាង", pos: "អ្នកជំនាញដេគ័រ", img: "samnang.jpg" },
    { slug: "chiv-vutha", name: "ជីវ វុត្ថា", pos: "អ្នកគ្រប់គ្រងសេវាកម្ម", img: "vutha.jpg" },
  ];

  for (const t of team) {
    await prisma.teamMember.create({
      data: {
        slug: t.slug,
        image: t.img,
        translations: {
          kh: { name: t.name, position: t.pos, bio: "បទពិសោធន៍ច្រើនឆ្នាំក្នុងវិស័យ Catering" },
          en: { name: t.slug.replace("-", " "), position: t.pos, bio: "Professional in catering service" }
        }
      }
    });
  }

  // ៨. បង្កើត Users & Bookings ច្រើន
  console.log("📝 កំពុងបង្កើត Bookings...");
  const user1 = await prisma.user.create({ data: { name: "Sok Dara", phone: "012345678", role: "USER" } });
  const user2 = await prisma.user.create({ data: { name: "Meas Sreymom", phone: "099112233", role: "USER" } });

  const bookings = [
    { name: "លោក វណ្ណៈ", user: user1.id, date: "2024-05-20", cat: weddingPackage.id, price: 1500 },
    { name: "អ្នកស្រី ស្រីមុំ", user: user2.id, date: "2024-06-15", cat: partyPackage.id, price: 800 },
    { name: "លោក ចាន់ណា", user: user1.id, date: "2024-07-10", cat: weddingPackage.id, price: 1500 },
  ];

  for (const b of bookings) {
    await prisma.booking.create({
      data: {
        customerName: b.name,
        phoneNumber: "010000000",
        userId: b.user,
        programType: "កម្មវិធី",
        programDate: b.date,
        event_date: new Date(b.date),
        location: "Phnom Penh",
        guestCount: 200,
        serviceType: "Full Service",
        totalPrice: b.price,
        status: "Confirmed",
        catering_id: b.cat,
        hasFood: true
      }
    });
  }

  console.log("✅ Seed ទិន្នន័យបានជោគជ័យពេញលេញ!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());