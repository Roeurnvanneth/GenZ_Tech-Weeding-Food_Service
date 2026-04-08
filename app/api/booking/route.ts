import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // ១. ទាញយកម្ហូបពី Catering ដើម្បីគណនាតម្លៃ (Cart Logic)
    const catering = await prisma.catering.findUnique({
      where: { id: Number(body.catering_id) },
      include: {
        items: {
          include: {
            menu: {
              include: { pricings: { where: { status: "active" }, take: 1 } }
            }
          }
        }
      }
    });

    if (!catering) {
      return NextResponse.json({ success: false, error: "រកមិនឃើញ Catering ID នេះទេ" }, { status: 404 });
    }

    // ២. គណនាតម្លៃសរុបចេញពីម្ហូបនីមួយៗក្នុងឈុត
    let calculatedTotal = 0;
    const bookingItems = catering.items.map(item => {
      const price = Number(item.menu.pricings[0]?.price_usd || 0);
      calculatedTotal += price;
      return { menu_pricing_id: item.menu.pricings[0].id, quantity: 1 };
    });

    // ៣. បង្កើត Booking
    const newBooking = await prisma.booking.create({
      data: {
        customerName: body.customerName,
        phoneNumber: body.phoneNumber,
        programType: body.programType,
        programDate: body.programDate,
        programTime: body.programTime,
        event_date: new Date(body.programDate),
        location: body.location,
        guestCount: Number(body.guestCount),
        serviceType: body.serviceType,
        hasFood: body.hasFood || false,
        hasTent: body.hasTent || false,
        totalPrice: calculatedTotal, // តម្លៃដែលបូកអូតូ
        status: "Pending",
        catering_id: Number(body.catering_id),
        bookingItems: { create: bookingItems }
      }
    });

    return NextResponse.json({ success: true, data: newBooking }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = await prisma.booking.findMany({
      include: { catering: true, bookingItems: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}