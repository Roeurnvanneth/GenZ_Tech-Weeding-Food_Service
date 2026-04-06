import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { menu_name, price_usd, categoryId } = body;

    // Validation
    if (!menu_name || !price_usd || !categoryId) {
      return NextResponse.json({ success: false, message: "សូមបំពេញព័ត៌មានឱ្យគ្រប់គ្រាន់" }, { status: 400 });
    }

    const newMenu = await prisma.menu.create({
      data: {
        menu_name,
        price_usd: parseFloat(price_usd),
        price_khr: parseFloat(price_usd) * 4000,
        categoryId: parseInt(categoryId),
        status: body.status || "active",
      },
    });

    return NextResponse.json({ success: true, data: newMenu }, { status: 201 });
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, message: "មិនអាចបង្កើតបានឡើយ" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      include: { category: true },
      orderBy: { id: "desc" },
    });
    return NextResponse.json({ success: true, data: menus });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}