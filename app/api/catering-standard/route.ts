import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ==========================================
// 🟢 CREATE CATERING STANDARD (POST)
// ==========================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ 
        success: false, 
        error: "សូមបញ្ចូលឈ្មោះ Standard (ឧទាហរណ៍៖ Standard A)" 
      }, { status: 400 });
    }

    const newStandard = await prisma.cateringStandard.create({
      data: { name: name }
    });

    return NextResponse.json({ 
      success: true, 
      message: "បង្កើត Standard ជោគជ័យ!", 
      data: newStandard 
    }, { status: 201 });

  } catch (error: any) {
    // ឆែកមើលបើឈ្មោះជាន់គ្នា (Unique Constraint)
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: "ឈ្មោះ Standard នេះមានរួចហើយ!" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ==========================================
// 🔵 GET ALL STANDARDS (GET)
// ==========================================
export async function GET() {
  try {
    const standards = await prisma.cateringStandard.findMany({
      orderBy: { id: 'asc' }
    });
    return NextResponse.json({ success: true, data: standards });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}