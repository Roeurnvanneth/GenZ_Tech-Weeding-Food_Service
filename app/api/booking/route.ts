import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { 
      customerName, phoneNumber, programType, programDate, 
      programTime, location, guestCount, startDateTime, 
      endDateTime, contactMethod, foodProductId, tentProductId,
      lang // 👈 Get language from frontend
    } = body;

    // --- 1. LANGUAGE MESSAGES ---
    const isEn = lang === 'en';
    const msg = {
      slotTaken: isEn ? "This time slot is already booked." : "ម៉ោងនេះមានគេកក់រួចហើយ សូមជ្រើសរើសម៉ោងផ្សេង",
      phoneTaken: isEn ? "You already have a booking for this day." : "លេខទូរស័ព្ទនេះបានកក់រួចហើយសម្រាប់ថ្ងៃនេះ",
      dayFull: isEn ? "Sorry, we are fully booked for this day." : "សុំទោស! ថ្ងៃនេះមានអ្នកកក់ពេញហើយ"
    };

    // --- 2. PREVENT DUPLICATE SLOT (Same Date + Same Time) ---
    const existingSlot = await prisma.booking.findFirst({
      where: {
        programDate: programDate,
        programTime: programTime,
      }
    });

    if (existingSlot) {
      return NextResponse.json({ success: false, error: msg.slotTaken }, { status: 400 });
    }

    // --- 3. PREVENT DUPLICATE PHONE ON SAME DAY ---
    const existingPhone = await prisma.booking.findFirst({
      where: {
        phoneNumber: phoneNumber,
        programDate: programDate,
      }
    });

    if (existingPhone) {
      return NextResponse.json({ success: false, error: msg.phoneTaken }, { status: 400 });
    }

    // --- 4. MAX 3 PER DAY CHECK ---
    const dailyCount = await prisma.booking.count({
      where: { programDate: programDate }
    });

    if (dailyCount >= 3) {
      return NextResponse.json({ success: false, error: msg.dayFull }, { status: 400 });
    }

    // --- 5. PRICE LOGIC (SAME AS BEFORE) ---
    let pricePerTable = 0;
    let selectedServices: string[] = [];

    if (foodProductId) {
      const food = await prisma.product.findUnique({ where: { id: Number(foodProductId) } });
      if (food) { pricePerTable += food.price; selectedServices.push("Food"); }
    }

    if (tentProductId) {
      const tent = await prisma.product.findUnique({ where: { id: Number(tentProductId) } });
      if (tent) { pricePerTable += tent.price; selectedServices.push("Tent"); }
    }

    const totalTables = Number(guestCount) || 0;
    const finalTotal = pricePerTable * totalTables;
    const serviceName = selectedServices.join(" & ") || "Standard";

    // --- 6. CREATE BOOKING ---
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
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        foodProduct: {
          include: { category: true } // Get the category of the food
        },
        tentProduct: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Fetch failed" });
  }
}