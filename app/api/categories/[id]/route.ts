import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


// 🔍 SHARED VALIDATOR
function validateTranslations(translations: any) {
  if (!translations || typeof translations !== "object") return "Translations must be an object";
  if (!translations.kh || !translations.en) return "Must include 'kh' and 'en'";
  return null;
}

type Props = { params: Promise<{ id: string }> };

// 🔵 GET SINGLE CATEGORY
export async function GET(request: Request, { params }: Props) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid ID format" }, { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true } // បង្ហាញផលិតផលក្នុង Category នេះ
    });

    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Fetch error" }, { status: 500 });
  }
}

// 🟠 UPDATE CATEGORY (PUT)
export async function PUT(request: Request, { params }: Props) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid ID format" }, { status: 400 });
    }

    const body = await request.json();
    const { slug, translations, isPoppular } = body;

    // ឆែកមើលថាតើ Category នេះមានពិតមែនអត់មុននឹង Update
    const exists = await prisma.category.findUnique({ where: { id } });
    if (!exists) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { 
        slug, 
        translations,
        isPoppular: isPoppular !== undefined ? isPoppular : exists.isPoppular
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Updated successfully", 
      data: updated 
    });

  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
  }
}

// 🔴 DELETE CATEGORY
export async function DELETE(request: Request, { params }: Props) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
    }

    // ចំណុចសំខាន់: ឆែកមើលថាមាន Product ជាប់ជាមួយ Category នេះអត់
    const categoryWithProducts = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } }
    });

    if (categoryWithProducts?._count.products! > 0) {
      return NextResponse.json({ 
        success: false, 
        error: "Cannot delete! This category contains products." 
      }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Category removed successfully" });

  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ success: false, error: "Delete failed" }, { status: 500 });
  }
}