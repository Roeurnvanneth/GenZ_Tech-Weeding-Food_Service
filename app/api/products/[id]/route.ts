import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

// PUT: កែប្រែ Product
export async function PUT(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        title: body.title,
        slug: body.slug,
        maxPrice: Number(body.maxPrice),
        hallPrice: Number(body.hallPrice) || 0,
        videoUrl: body.videoUrl,
        categoryId: Number(body.categoryId),
        isPoppular: Boolean(body.isPoppular),
        images: body.images,
        translations: body.translations,
      },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE: លុប Product
export async function DELETE(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}