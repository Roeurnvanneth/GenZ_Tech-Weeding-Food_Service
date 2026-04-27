import 'dotenv/config';

import { prisma } from "../lib/prisma"; // Adjust this path to match your project structure

async function main() {
  console.log("🚀 Starting seed...");

  // 1. Event Types
  const wedding = await prisma.eventType.create({
    data: {
      event_type_name_en: "Wedding",
      event_type_name_kh: "ពិធីមង្គលការ",
      cover_image_url: "https://example.com/wedding.jpg",
    },
  });

  // 2. Menu Items
  const chicken = await prisma.menuItem.create({
    data: {
      menu_item_name_en: "Fried Chicken",
      menu_item_name_kh: "មាន់បំពង",
      cover_image_url: "https://example.com/chicken.jpg",
    },
  });

  const fish = await prisma.menuItem.create({
    data: {
      menu_item_name_en: "Grilled Fish",
      menu_item_name_kh: "ត្រីអាំង",
      cover_image_url: "https://example.com/fish.jpg",
    },
  });

  // 3. Catering Standard
  const vipSet = await prisma.cateringStandard.create({
    data: {
      event_type_id: wedding.id,
      catering_standard_name_en: "VIP Set",
      catering_standard_name_kh: "ស្តង់ដារ VIP",
      cover_image_url: "https://example.com/vip.jpg",
      is_special: true,
      description: "Premium wedding set",
    },
  });

  // 4. Link Menu Items
  // Note: Must include price_usd and price_khr because they are required in your schema
  await prisma.cateringStandardItem.createMany({
    data: [
      {
        catering_standard_id: vipSet.id,
        menu_item_id: chicken.id,
        price_usd: 12.0,
        price_khr: 48000,
      },
      {
        catering_standard_id: vipSet.id,
        menu_item_id: fish.id,
        price_usd: 15.0,
        price_khr: 60000,
      },
    ],
  });

  // 5. Menu Gallery
  await prisma.menuItemGallery.createMany({
    data: [
      {
        menu_item_id: chicken.id,
        image_url: "https://example.com/chicken1.jpg",
      },
      {
        menu_item_id: chicken.id,
        image_url: "https://example.com/chicken2.jpg",
      },
    ],
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });