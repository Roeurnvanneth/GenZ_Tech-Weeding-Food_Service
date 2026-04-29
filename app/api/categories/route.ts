import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust this path to your prisma client location

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true, // must match schema relation name
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    console.error("CATEGORY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // បញ្ហាគឺនៅត្រង់នេះ៖ Prisma ត្រូវការ "name" ជា String ដាច់ខាត
    // យើងយកឈ្មោះពី translations.kh.name ឬ body.name
    const categoryName = body.name || body.translations?.kh?.name || body.slug;

    if (!categoryName) {
      return NextResponse.json({ success: false, error: "សូមបញ្ចូលឈ្មោះប្រភេទ (Name is required)" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name: categoryName, // ដាក់ឈ្មោះដែលយើងទាញបានមិញនេះ
        slug: body.slug,
        description: body.description || "",
        isPoppular: Boolean(body.isPoppular),
        translations: body.translations || {},
      },
    });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}