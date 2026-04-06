import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: ទាញយក Categories ទាំងអស់
export async function GET() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { id: 'asc' } });
    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: បង្កើត Category ថ្មី
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || "",
        isPoppular: Boolean(body.isPoppular),
        translations: body.translations || {},
      },
    });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}