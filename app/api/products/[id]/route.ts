// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ---------------------------
// GET PRODUCT BY ID
// ---------------------------
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch product", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// ---------------------------
// UPDATE PRODUCT BY ID
// ---------------------------
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const body = await request.json();
    const { slug, images, price, isPoppular, translations, categoryId } = body;

    // Validate required fields
    if (!slug || !images || price === undefined || isPoppular === undefined || !translations || !categoryId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Validate translations
    if (!translations.kh || !translations.en) {
      return NextResponse.json({ success: false, error: "Translations must include 'kh' and 'en'" }, { status: 400 });
    }

    for (const [lang, t] of Object.entries(translations)) {
      if (!translations.name || !translations.description) {
        return NextResponse.json({ success: false, error: `Translation for '${lang}' must include 'name' and 'description'` }, { status: 400 });
      }
    }

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        slug,
        images,
        price: parseFloat(price),
        isPoppular: Boolean(isPoppular),
        translations,
        categoryId,
      },
    });

    return NextResponse.json({ success: true, message: "Product updated", data: updatedProduct });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update product", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// ---------------------------
// DELETE PRODUCT BY ID
// ---------------------------
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Product deleted", deletedProduct: existingProduct });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete product", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}