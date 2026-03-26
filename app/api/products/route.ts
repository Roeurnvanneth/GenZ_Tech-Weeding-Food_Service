import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🟢 POST: Create a new product (using JSON)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, imges, categoryId, price, translations } = body;

    if (!slug || !categoryId || price === undefined) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        slug,
        price: Number(price),
        categoryId: Number(categoryId),
        images: imges ? [imges] : [], // Saves URL into an array
        translations: translations || {},
        isPoppular: false,
      },
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🔵 GET: List all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { id: 'desc' }
    });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Fetch failed" }, { status: 500 });
  }
}