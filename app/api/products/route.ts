import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
   // Inside your POST function in app/api/products/route.ts
const body = await request.json();

// 1. Destructure
const { slug, maxPrice, hallPrice, videoUrl, categoryId, isPoppular, images, translations } = body;

// 2. Force conversion to numbers and strings
const product = await prisma.product.create({
  data: {
    slug: String(slug),
    maxPrice: Number(maxPrice) || 0,
    hallPrice: Number(hallPrice) || 0,
    videoUrl: videoUrl || null,
    isPoppular: Boolean(isPoppular),
    images: Array.isArray(images) ? images : [],
    translations: translations || {},
    // 💡 This is the part that was failing:
    categoryId: Number(categoryId), 
  },
});

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    console.error("PRISMA ERROR:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}