import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { 
      customerName, phoneNumber, programType, programDate, 
      programTime, location, guestCount, startDateTime, 
      endDateTime, contactMethod, foodProductId, tentProductId 
    } = body;

    // 1. Max 3 Bookings Per Day Check
    const dailyCount = await prisma.booking.count({
      where: { programDate: programDate }
    });

    if (dailyCount >= 3) {
      return NextResponse.json({ 
        success: false, 
        error: "សុំទោស! ថ្ងៃនេះមានអ្នកកក់ពេញហើយ" 
      }, { status: 400 });
    }

    // 2. Dynamic Price Fetching Logic
    let pricePerTable = 0;
    let selectedServices: string[] = [];

    // Check Food Product Price
    if (foodProductId) {
      const food = await prisma.product.findUnique({ where: { id: Number(foodProductId) } });
      if (food) {
        pricePerTable += food.price;
        selectedServices.push("Food");
      }
    }

    // Check Tent Product Price
    if (tentProductId) {
      const tent = await prisma.product.findUnique({ where: { id: Number(tentProductId) } });
      if (tent) {
        pricePerTable += tent.price;
        selectedServices.push("Tent");
      }
    }

    // 3. Calculation
    const totalTables = Number(guestCount) || 0;
    const finalTotal = pricePerTable * totalTables;
    const serviceName = selectedServices.join(" & ") || "Standard";

    // 4. Create in Database
    const newBooking = await prisma.booking.create({
      data: {
        customerName,
        phoneNumber,
        programType,
        programDate,
        programTime,
        location,
        guestCount: totalTables,
        startDateTime,
        endDateTime,
        contactMethod,
        hasFood: !!foodProductId,
        hasTent: !!tentProductId,
        totalPrice: finalTotal,
        serviceType: serviceName,
        status: "Pending",
        translations: {
          en: { service: serviceName, message: "Thank you for booking!" },
          kh: { service: "សេវាកម្មម្ហូប និងរោង", message: "សូមអរគុណសម្រាប់ការកក់!" }
        }
      },
    });

    return NextResponse.json({ success: true, data: newBooking }, { status: 201 });

  } catch (error: any) {
    console.error("DATABASE ERROR:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal Server Error", 
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({ 
      orderBy: { createdAt: 'desc' } 
    });
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Fetch failed" }, { status: 500 });
  }
}