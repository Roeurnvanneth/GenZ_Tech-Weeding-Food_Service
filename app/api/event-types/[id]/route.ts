import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name } = await request.json();
    const updated = await prisma.eventType.update({
      where: { id: parseInt(params.id) },
      data: { name }
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.eventType.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "មិនអាចលុបបានទេ ព្រោះវាមានជាប់ទាក់ទងនឹងទិន្នន័យផ្សេង" }, { status: 500 });
  }
}