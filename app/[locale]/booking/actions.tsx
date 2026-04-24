"use server";
import { prisma } from "@/lib/prisma";

export async function createBooking(data: any) {
  try {
    return await prisma.$transaction(async (tx) => {
      return await tx.booking.create({
        data: {
          customerName: data.customerName,
          phoneNumber: data.phoneNumber,
          location: data.location,
          guestCount: Number(data.guestCount),
          totalPrice: parseFloat(data.totalPrice),
          programDate: new Date(data.event_date),
          event_date: new Date(data.event_date),
          bookingItems: {
            create: data.items.map((item: any) => ({
              menu_pricing_id: Number(item.menu_pricing_id),
              quantity: Number(item.quantity),
              price: parseFloat(item.price),
            })),
          },
        },
      });
    });
  } catch (error) {
    console.error("Booking Error:", error);
    throw new Error("ការកក់មិនបានជោគជ័យ។ សូមពិនិត្យទិន្នន័យរបស់អ្នក។");
  }
}