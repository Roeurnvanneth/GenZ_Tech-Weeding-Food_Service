import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// =======================
// 🟢 CREATE CATEGORY (POST)
// =======================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, translations } = body;

    if (!slug || !translations) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newCategory = await prisma.category.create({
      data: { slug, translations },
    });

    return NextResponse.json({ success: true, message: "Created!", data: newCategory }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Create failed" }, { status: 500 });
  }
}

// =======================
// 🔵 GET ALL CATEGORIES (GET)
// =======================
export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Fetch failed" }, { status: 500 });
  }
}