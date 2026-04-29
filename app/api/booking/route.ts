import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// =======================
// GET BOOKINGS
// =======================
export async function GET() {
  try {
    const data = await prisma.booking.findMany({
      include: {
        user: true,
        product: true,
        category: true,
        bookingItems: {
          include: {
            product: true,
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// =======================
// CREATE BOOKING
// =======================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      customerName,
      phoneNumber,
      userId,
      eventDate,
      startDateTime,
      endDateTime,
      location,
      guestCount,
      productId,
      categoryId,
      items,
    } = body;

    let totalPrice = 0;

    const bookingItemsData: Prisma.BookingItemCreateWithoutBookingInput[] =
      [];

    // =========================
    // SAFE ITEMS HANDLING
    // =========================
    if (Array.isArray(items) && items.length > 0) {
      const ids = items
        .map((i: any) => Number(i?.productId))
        .filter((id: number) => Number.isFinite(id) && id > 0);

      if (ids.length === 0) {
        return NextResponse.json(
          { success: false, error: "No valid product items found" },
          { status: 400 }
        );
      }

      const products = await prisma.product.findMany({
        where: {
          id: { in: ids },
        },
      });

      const map = new Map<number, (typeof products)[number]>();
      products.forEach((p) => map.set(p.id, p));

      for (const item of items) {
        const pid = Number(item?.productId);

        if (!Number.isFinite(pid)) continue;

        const product = map.get(pid);
        if (!product) continue;

        const quantity = Number(item?.quantity || 1);
        const price = Number(product.price);

        totalPrice += price * quantity;

        bookingItemsData.push({
          product: {
            connect: { id: product.id },
          },
          quantity,
          price,
        });
      }
    }

    // =========================
    // CREATE BOOKING
    // =========================
    const booking = await prisma.booking.create({
      data: {
        customerName,
        phoneNumber,
        userId: userId ? Number(userId) : null,
        eventDate: new Date(eventDate),
        startDateTime: startDateTime ? new Date(startDateTime) : null,
        endDateTime: endDateTime ? new Date(endDateTime) : null,
        location,
        guestCount: Number(guestCount || 0),
        productId: productId ? Number(productId) : null,
        categoryId: categoryId ? Number(categoryId) : null,
        totalPrice,

        bookingItems: {
          create: bookingItemsData,
        },
      },
      include: {
        user: true,
        product: true,
        category: true,
        bookingItems: {
          include: {
            product: true,
            category: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: booking });
  } catch (error: any) {
    console.error("BOOKING ERROR:", error);

    return NextResponse.json(
      { success: false, error: error.message || "Booking failed" },
      { status: 500 }
    );
  }
}