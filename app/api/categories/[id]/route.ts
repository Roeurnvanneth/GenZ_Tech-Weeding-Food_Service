import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });
    if (!category) return NextResponse.json({ error: "រកមិនឃើញ" }, { status: 404 });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    // ទាញយក Name ឱ្យ Prisma ដូចគ្នា កុំឱ្យវា Error ពេល Update
    const categoryName = body.name || body.translations?.kh?.name;

    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: {
        name: categoryName,
        slug: body.slug,
        description: body.description,
        isPoppular: body.isPoppular,
        translations: body.translations,
      },
    });

    return NextResponse.json({ success: true, data: updatedCategory });
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.category.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ success: true, message: "លុបបានជោគជ័យ" });
  } catch (error: any) {
    // បើលុបមិនចេញ ប្រហែលមកពីមាន ម្ហូប (Menus) កំពុងប្រើ Category ហ្នឹង
    return NextResponse.json({ error: "មិនអាចលុបបានទេ! សូមលុបមុខម្ហូបក្នុងប្រភេទនេះចេញសិន។" }, { status: 500 });
  }
}