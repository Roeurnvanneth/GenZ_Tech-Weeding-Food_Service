import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: ទាញយក Products ទាំងអស់
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // បង្កើត Product
    const product = await prisma.product.create({
      data: {
        // ប្រសិនបើក្នុង Schema ប្អូនមាន field title តែ Frontend អត់ផ្ញើមក 
        // ប្អូនអាចយកឈ្មោះពី translations.kh.name មកដាក់ជំនួសបណ្ដោះអាសន្ន
        title: body.translations?.kh?.name || body.slug, 
        
        slug: body.slug,
        maxPrice: Number(body.maxPrice) || 0,
        hallPrice: Number(body.hallPrice) || 0,
        videoUrl: body.videoUrl || null,
        isPoppular: Boolean(body.isPoppular),
        images: Array.isArray(body.images) ? body.images : [],
        translations: body.translations || {}, // ត្រូវប្រាកដថា field នេះជា Json ក្នុង Schema
        categoryId: Number(body.categoryId),
      },
    });
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}