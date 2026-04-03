import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

// 🟠 PUT: កែប្រែព័ត៌មានផលិតផល
export async function PUT(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        slug: body.slug,
        maxPrice: Number(body.maxPrice),
        title: body.translations.en || "Untitled", // បន្ថែម Default Title ប្រសិនបើមិនមាន
        hallPrice: Number(body.hallPrice) || 0,
        videoUrl: body.videoUrl,
        categoryId: Number(body.categoryId),
        images: body.images, // បញ្ជូនជា Array ថ្មី
        translations: body.translations,
        isPoppular: body.isPoppular,
      },
    });
    
    return NextResponse.json({ success: true, message: "កែប្រែបានជោគជ័យ!", data: updated });
  } catch (error: any) {
    console.error("Update Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🔴 DELETE: លុបផលិតផល
export async function DELETE(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    
    await prisma.product.delete({
      where: { id: Number(id) },
    });
    
    return NextResponse.json({ success: true, message: "លុបផលិតផលបានជោគជ័យ!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "មិនអាចលុបបានទេ!" }, { status: 500 });
  }
}