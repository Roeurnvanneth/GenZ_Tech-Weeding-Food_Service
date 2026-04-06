import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const eventTypes = await prisma.eventType.findMany({
      include: {
        _count: { select: { cateringItems: true } } 
      },
      orderBy: { id: "asc" }
    });
    // បោះទិន្នន័យចេញជា JSON
    return NextResponse.json({ success: true, data: eventTypes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name) return NextResponse.json({ success: false, error: "សូមបញ្ចូលឈ្មោះ" }, { status: 400 });

    const newType = await prisma.eventType.create({ data: { name: body.name } });
    return NextResponse.json({ success: true, data: newType }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "ឈ្មោះនេះមានរួចហើយ" }, { status: 400 });
  }
}