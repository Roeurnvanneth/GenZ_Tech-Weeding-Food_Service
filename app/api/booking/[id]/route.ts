import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

// 🔵 GET: Fetch one booking to show the Invoice for Admin
export async function GET(request: Request, { params }: Props) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id: Number(id) } });
  
  if (!booking) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: booking });
}

// 🟠 PATCH: Admin Accepts or Rejects
export async function PATCH(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body; // Expected: "Accepted" or "Rejected"

    if (!["Accepted", "Rejected"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: Number(id) },
      data: { status: status },
    });

    return NextResponse.json({ 
      success: true, 
      message: `Booking has been ${status}`, 
      data: updatedBooking 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    await prisma.booking.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true, message: "Booking removed" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Delete failed" }, { status: 500 });
  }
}