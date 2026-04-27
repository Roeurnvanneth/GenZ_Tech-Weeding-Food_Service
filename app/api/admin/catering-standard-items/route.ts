import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET ALL
export async function GET() {
  try {
    const data = await prisma.cateringStandardItem.findMany({
      include: {
        cateringStandard: true,
        menuItem: true,
      },
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch" }, { status: 500 });
  }
}

// CREATE
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { catering_standard_id, menu_item_id, price_usd, price_khr } = body;

    const result = await prisma.cateringStandardItem.upsert({
      where: {
        catering_standard_id_menu_item_id: {
          catering_standard_id: Number(catering_standard_id),
          menu_item_id: Number(menu_item_id),
        },
      },
      update: {
        price_usd: parseFloat(price_usd),
        price_khr: parseFloat(price_khr),
      },
      create: {
        catering_standard_id: Number(catering_standard_id),
        menu_item_id: Number(menu_item_id),
        price_usd: parseFloat(price_usd),
        price_khr: parseFloat(price_khr),
      },
      include: { cateringStandard: true, menuItem: true },
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to process" }, { status: 500 });
  }
}