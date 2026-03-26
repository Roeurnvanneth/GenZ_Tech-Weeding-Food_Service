import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }>;
};

// 🟡 GET: Fetch one specific product
export async function GET(request: Request, { params }: Props) {
  try {
    const { id } = await params; // Next.js 15 fix
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { category: true }
    });
    
    if (!product) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error fetching" }, { status: 500 });
  }
}

// 🟠 PUT: Update a product
export async function PUT(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        slug: body.slug,
        price: body.price ? Number(body.price) : undefined,
        videoUrl: body.videoUrl,
        categoryId: body.categoryId ? Number(body.categoryId) : undefined,
        images: body.imges ? [body.imges] : undefined,
        translations: body.translations,
      },
    });
    
    return NextResponse.json({ success: true, message: "Updated!", data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
  }
}

// 🔴 DELETE: Remove a product
export async function DELETE(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Delete failed" }, { status: 500 });
  }
}