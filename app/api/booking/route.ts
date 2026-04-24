import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ១. ទាញយកព័ត៌មាន Catering និងតម្លៃម្ហូបនីមួយៗ
    // ប្រសិនបើ body.catering_id អាចជា null/undefined ត្រូវការពារវា
    const cateringId = body.catering_id ? Number(body.catering_id) : null;

    let catering = null;
    if (cateringId) {
      catering = await prisma.catering.findUnique({
        where: { id: cateringId },
        include: {
          items: {
            include: {
              menu: {
                include: {
                  pricings: { where: { status: "active" }, take: 1 }
                }
              }
            }
          }
        }
      });
    }

    // ២. គណនាតម្លៃសរុប (ប្រសិនបើមាន Catering)
    let calculatedTotal = Number(body.totalPrice) || 0;
    let bookingItemsData: any[] = [];

    if (catering) {
      bookingItemsData = catering.items.map(item => {
        const pricing = item.menu.pricings[0];
        const price = Number(pricing?.price_usd || 0);
        return {
          menu_pricing_id: pricing.id,
          quantity: 1, 
          price: price 
          
        };
      });
    } else {
        // ប្រសិនបើកក់ដោយមិនជ្រើសរើស Catering (កក់តាម Cart ធម្មតា)
        bookingItemsData = body.items.map((item: any) => ({
            menu_pricing_id: Number(item.menu_pricing_id),
            quantity: Number(item.quantity),
            price: Number(item.price)
        }));
    }

    // ៣. បង្កើត Booking ក្នុង Transaction
    const newBooking = await prisma.$transaction(async (tx) => {
      return await tx.booking.create({
        data: {
          customerName: body.customerName,
          phoneNumber: body.phoneNumber,
          programDate: new Date(body.programDate),
          event_date: new Date(body.programDate),
          location: body.location,
          guestCount: Number(body.guestCount),
          totalPrice: calculatedTotal,
          status: "Pending",
          catering_id: cateringId,
          bookingItems: {
            create: bookingItemsData
          }
        }
      });
    });

    return NextResponse.json({ success: true, data: newBooking }, { status: 201 });

  } catch (error: any) {
    console.error("Booking Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = await prisma.booking.findMany({
      include: { 
        catering: true, 
        bookingItems: { include: { menuPricing: true } } 
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}