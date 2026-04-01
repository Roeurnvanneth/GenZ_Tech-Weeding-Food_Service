import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Use your existing prisma lib

type Props = {
  params: Promise<{ id: string }>;
};

// 🟡 GET: Get single team member
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    
    const teamMember = await prisma.teamMember.findUnique({
      // Convert string ID from URL to Number for your schema
      where: { id: Number(id) },
    });

    if (!teamMember) {
      return NextResponse.json({ success: false, error: "Team member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: teamMember });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}

// 🟠 PUT: Update team member
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { translations, image, slug } = body;

    // Use provided slug or generate one if slug isn't in body
    const finalSlug = slug || translations.en.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const teamMember = await prisma.teamMember.update({
      where: { id: Number(id) },
      data: {
        slug: finalSlug,
        image,
        translations,
      },
    });

    return NextResponse.json({ success: true, data: teamMember });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
  }
}

// 🔴 DELETE: Delete team member
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    
    await prisma.teamMember.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: "Team member deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Delete failed" }, { status: 500 });
  }
}