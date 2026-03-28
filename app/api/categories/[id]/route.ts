import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


// 🔍 SHARED VALIDATOR
function validateTranslations(translations: any) {
  if (!translations || typeof translations !== "object") return "Translations must be an object";
  if (!translations.kh || !translations.en) return "Must include 'kh' and 'en'";
  return null;
}

// 🔵 UPDATE (PUT)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid ID format" }, { status: 400 });
    }

    const body = await request.json();
    const { slug, translations } = body;

    const updated = await prisma.category.update({
      where: { id },
      data: { 
        slug, 
        translations 
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
  }
}

// 🔴 DELETE
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ success: false, error: "Delete failed" }, { status: 500 });
  }
}