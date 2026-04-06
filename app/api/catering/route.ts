import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      event_name, 
      name, 
      description, 
      total_price, 
      catering_standard_id, 
      eventTypeId, 
      menuIds 
    } = body;

    // Validation: check if menuIds is actually an array
    const safeMenuIds = Array.isArray(menuIds) ? menuIds : [];

    const newCatering = await prisma.catering.create({
      data: {
        // satisfy the 'name' requirement from your error
        name: name || "Default Name", 
        catering_name: name || event_name, 
        event_name: event_name,
        description: description,
        
        // Ensure numbers are converted correctly
        total_price: parseFloat(total_price.toString()),
        menuId: safeMenuIds, 
        catering_standard_id: parseInt(catering_standard_id.toString()),
        eventTypeId: parseInt(eventTypeId.toString()),
        
        // Create child items
        items: {
          create: safeMenuIds.map((mId: any) => ({
            menuId: parseInt(mId.toString()),
            eventTypeId: parseInt(eventTypeId.toString())
          }))
        }
      },
      include: {
        standard: true,
        items: { include: { menu: true } }
      }
    });

    return NextResponse.json({ success: true, message: "ជោគជ័យ!", data: newCatering }, { status: 201 });
  } catch (error: any) {
    console.error("Prisma Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


// --- ១. បន្ថែម function GET នេះដើម្បីឱ្យ Dashboard ឃើញទិន្នន័យ ---
export async function GET() {
  try {
    const caterings = await prisma.catering.findMany({
      include: {
        standard: true,
        items: { include: { menu: true } }
      },
      orderBy: {
        id: 'desc' // បង្ហាញទិន្នន័យថ្មីបំផុតនៅខាងលើ
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: caterings 
    }, { status: 200 });
  } catch (error: any) {
    console.error("GET Error:", error.message);
    return NextResponse.json({ 
      success: false, 
      error: "មិនអាចទាញទិន្នន័យបានឡើយ" 
    }, { status: 500 });
  }
}