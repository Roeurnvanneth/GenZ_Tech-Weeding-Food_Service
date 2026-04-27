import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { translations, image, slug } = body;

    const newMember = await prisma.teamMember.create({
      data: {
        slug: slug || translations.en.name.toLowerCase().replace(/ /g, "-"),
        image,
        translations,
      },
    });

    return NextResponse.json({ success: true, data: newMember }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Creation failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const allMembers = await prisma.teamMember.findMany();
    return NextResponse.json({ success: true, data: allMembers });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Fetch failed" }, { status: 500 });
  }
}