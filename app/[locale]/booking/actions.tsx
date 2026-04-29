"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type BookingItemInput = {
  productId: number;
  quantity: number;
};

type BookingInput = {
  customerName: string;
  phoneNumber: string;
  eventDate: string;
  startDateTime?: string;
  endDateTime?: string;
  location: string;
  guestCount: number;
  userId?: number;
  productId?: number;
  categoryId?: number;
  items?: BookingItemInput[];
};

export async function createBooking(data: BookingInput) {
  try {
    return await prisma.$transaction(async (tx) => {
      const items = Array.isArray(data.items) ? data.items : [];

      // =========================
      // CLEAN IDS (FIX NaN ISSUE)
      // =========================
      const ids = items
        .map((i) => Number(i.productId))
        .filter((id) => Number.isFinite(id) && id > 0);

      let totalPrice = 0;

      if (ids.length === 0) {
        throw new Error("No valid products in cart");
      }

      const products = await tx.product.findMany({
        where: { id: { in: ids } },
      });

      const map = new Map<number, (typeof products)[number]>();
      products.forEach((p) => map.set(p.id, p));

      const bookingItems: Prisma.BookingItemCreateWithoutBookingInput[] = [];

      for (const item of items) {
        const productId = Number(item.productId);
        const product = map.get(productId);

        if (!product || !Number.isFinite(productId)) continue;

        const quantity = Number(item.quantity || 1);
        const price = Number(product.price);

        totalPrice += price * quantity;

        bookingItems.push({
          product: {
            connect: { id: product.id },
          },
          quantity,
          price,
        });
      }

      if (bookingItems.length === 0) {
        throw new Error("No valid booking items found");
      }

      const booking = await tx.booking.create({
        data: {
          customerName: data.customerName,
          phoneNumber: data.phoneNumber,
          location: data.location,
          guestCount: Number(data.guestCount || 0),

          userId: data.userId ?? null,
          productId: data.productId ?? null,
          categoryId: data.categoryId ?? null,

          eventDate: new Date(data.eventDate),
          startDateTime: data.startDateTime
            ? new Date(data.startDateTime)
            : null,
          endDateTime: data.endDateTime
            ? new Date(data.endDateTime)
            : null,

          totalPrice,

          bookingItems: {
            create: bookingItems,
          },
        },
        include: {
          bookingItems: true,
        },
      });

      return {
        success: true,
        data: booking,
      };
    });
  } catch (error: any) {
    console.error("BOOKING ERROR:", error);

    return {
      success: false,
      error: error.message,
    };
  }
}