import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ១. មុខងារទាញទិន្នន័យ (GET)
export async function GET() {
  try {
    const eventTypes = await prisma.eventType.findMany({
      include: {
        _count: { select: { cateringItems: true } }
      },
      orderBy: { id: "asc" }
    });
    // បញ្ជូនទិន្នន័យត្រឡប់ទៅវិញក្នុងទម្រង់ success: true និង data: []
    return NextResponse.json({ success: true, data: eventTypes }, { status: 200 });
  } catch (error: any) {
    console.error("GET Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ២. មុខងារបង្កើតថ្មី (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: "សូមបញ្ចូលឈ្មោះ" }, { status: 400 });
    }

    const newType = await prisma.eventType.create({ 
      data: { name: body.name } 
    });
    return NextResponse.json({ success: true, data: newType }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "ឈ្មោះនេះមានរួចហើយ ឬមានបញ្ហា Database" }, { status: 400 });
  }
}