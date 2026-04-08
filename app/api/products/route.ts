import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Destructure - Added 'title' here
    const { 
      title, 
      slug, 
      maxPrice, 
      hallPrice, 
      videoUrl, 
      categoryId, 
      isPoppular, 
      images, 
      translations 
    } = body;

    // 2. Create the product
    const product = await prisma.product.create({
      data: {
        title: String(title), // 👈 This was the missing piece
        slug: String(slug),
        maxPrice: Number(maxPrice) || 0,
        hallPrice: Number(hallPrice) || 0,
        videoUrl: videoUrl || null,
        isPoppular: Boolean(isPoppular),
        images: Array.isArray(images) ? images : [],
        translations: translations || {},
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