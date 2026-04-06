import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


async function main() {
  console.log("🚀 កំពុងចាប់ផ្ដើមដាក់ទិន្នន័យ Seed ឱ្យត្រូវតាម Schema ថ្មី...");

  // ១. សម្អាតទិន្នន័យចាស់ (លុបតាមលំដាប់ដើម្បីកុំឱ្យទើស Foreign Key)
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

  // ២. បង្កើត Categories (សម្រាប់ Menu និង Product)
  const catFood = await prisma.category.create({
    data: {
      name: "មុខម្ហូបខ្មែរ",
      slug: "khmer-food",
      isPoppular: true,
      translations: { kh: "មុខម្ហូបខ្មែរ", en: "Khmer Dishes" }
    }
  });

  // ៣. បង្កើត Event Types (ប្រភេទកម្មវិធី)
  const evWedding = await prisma.eventType.create({ data: { name: "អាពាហ៍ពិពាហ៍ (Wedding)" } });
  const evFuneral = await prisma.eventType.create({ data: { name: "បុណ្យទាន (Religious)" } });
  const evBirthday = await prisma.eventType.create({ data: { name: "ខួបកំណើត (Birthday)" } });

  // ៤. បង្កើត Catering Standards
  const stdGold = await prisma.cateringStandard.create({ data: { name: "Gold Standard" } });
  const stdSilver = await prisma.cateringStandard.create({ data: { name: "Silver Standard" } });

  // ៥. បង្កើត Menus (មុខម្ហូប)
  const menusData = [
    { name: "គ្រាប់ស្វាយចន្ទីលីង", price: 5 },
    { name: "ញាំមាន់ត្រយូងចេក", price: 8 },
    { name: "ត្រីដុតមើមជួយ", price: 12 },
    { name: "ស៊ុបទាកាប៉ា", price: 15 },
    { name: "បង្គាបំពងខ្ទឹមស", price: 18 },
    { name: "បបរមឹក", price: 4 },
  ];

  const createdMenus = [];
  for (const m of menusData) {
    const menu = await prisma.menu.create({
      data: {
        menu_name: m.name,
        price_usd: m.price,
        price_khr: m.price * 4100,
        categoryId: catFood.id,
        status: "active"
      }
    });
    createdMenus.push(menu);

    // បង្កើត MenuPricing សម្រាប់ Menu នីមួយៗ (សម្រាប់ប្រើក្នុង BookingItem)
    await prisma.menuPricing.create({
      data: {
        menu_id: menu.id,
        price_usd: m.price,
        price_khr: m.price * 4100,
      }
    });
  }

  // ៦. បង្កើត Catering Packages (ឈុតម្ហូប)
  // --- ឈុតមង្គលការ ---
  const weddingPackage = await prisma.catering.create({
    data: {
      name: "Wedding Luxury Set A",
      catering_name: "ឈុតអាពាហ៍ពិពាហ៍កម្រិតមាស",
      event_name: "កម្មវិធីអាពាហ៍ពិពាហ៍ (Wedding)",
      description: "ឈុតម្ហូបពិសេស ៧ មុខ សម្រាប់ការរៀបការ",
      total_price: 1500.00,
      catering_standard_id: stdGold.id,
      eventTypeId: evWedding.id,
      menuId: [createdMenus[0].id, createdMenus[1].id, createdMenus[2].id, createdMenus[3].id]
    }
  });

  // --- ឈុតបុណ្យទាន ---
  const funeralPackage = await prisma.catering.create({
    data: {
      name: "Standard Religious Set",
      catering_name: "ឈុតបុណ្យទានបែបសាមញ្ញ",
      event_name: "កម្មវិធីបុណ្យ (Religious Ceremony)",
      description: "ម្ហូបសម្រាប់ទទួលភ្ញៀវក្នុងពិធីបុណ្យ",
      total_price: 850.00,
      catering_standard_id: stdSilver.id,
      eventTypeId: evFuneral.id,
      menuId: [createdMenus[5].id, createdMenus[1].id, createdMenus[3].id]
    }
  });

  // ៧. បង្កើត CateringItem (Pivot Table សម្រាប់ភ្ជាប់ Catering ទៅ Menu)
  await prisma.cateringItem.createMany({
    data: [
      { cateringId: weddingPackage.id, menuId: createdMenus[0].id, eventTypeId: evWedding.id },
      { cateringId: weddingPackage.id, menuId: createdMenus[1].id, eventTypeId: evWedding.id },
      { cateringId: funeralPackage.id, menuId: createdMenus[5].id, eventTypeId: evFuneral.id },
    ]
  });

  // ៨. បង្កើត User តេស្ត
  const testUser = await prisma.user.create({
    data: {
      name: "Sok Dara",
      phone: "012345678",
      role: "USER"
    }
  });

  // ៩. បង្កើត Real Bookings (ការកក់ពិតប្រាកដ)
  const booking1 = await prisma.booking.create({
    data: {
      customerName: "លោក វណ្ណៈ",
      phoneNumber: "099887766",
      userId: testUser.id,
      programType: "អាពាហ៍ពិពាហ៍",
      programDate: "2024-05-20",
      event_date: new Date("2024-05-20"),
      location: "បុរីប៉េងហួត បឹងស្នោ",
      guestCount: 500,
      serviceType: "Full Service",
      totalPrice: 1500.00,
      status: "Confirmed",
      catering_id: weddingPackage.id,
      hasFood: true
    }
  });

  const booking2 = await prisma.booking.create({
    data: {
      customerName: "អ្នកស្រី ស្រីមុំ",
      phoneNumber: "011223344",
      programType: "បុណ្យផ្ទះ",
      programDate: "2024-04-15",
      event_date: new Date("2024-04-15"),
      location: "ខណ្ឌច្បារអំពៅ",
      guestCount: 150,
      serviceType: "Catering Only",
      totalPrice: 850.00,
      status: "Pending",
      catering_id: funeralPackage.id,
      hasFood: true
    }
  });

  console.log("✅ Seed ជោគជ័យ! ប្អូនអាចឆែក Dashboard មើលទិន្នន័យពិតប្រាកដបានហើយ។");
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });