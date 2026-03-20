import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🔍 SHARED VALIDATOR
function validateTranslations(translations: any) {
  if (!translations || typeof translations !== "object") return "Translations must be an object";
  if (!translations.kh || !translations.en) return "Must include 'kh' and 'en'";
  return null;
}

// 🔵 GET ONE BY ID
export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Fetch failed" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Change type to Promise
) {
  try {
    // 2. UNWRAP THE PARAMS (This fixes your error)
    const { id: rawId } = await params; 
    
    console.log("Updating Category ID:", rawId); 
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid ID format" }, { status: 400 });
    }

    const body = await request.json();
    const { slug, translations } = body;

    // 3. Perform Update
    const updated = await prisma.category.update({
      where: { id },
      data: { slug, translations },
    });

    return NextResponse.json({ success: true, data: updated });

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ 
      success: false, message: "Update failed",
      error: "Update failed", 
      details: error instanceof Error ? error.message : "Error" 
    }, { status: 500 });
  }
}

// 🔴 ALSO UPDATE YOUR DELETE FUNCTION THE SAME WAY
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.category.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Delete failed" }, { status: 500 });
  }
}