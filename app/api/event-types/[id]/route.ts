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

// --- លុប (DELETE) ---
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // 🔥 ជំហានទី១: លុបទិន្នន័យក្នុងតារាងដែលពាក់ព័ន្ធនឹង EventType នេះជាមុនសិន
    // ឧទាហរណ៍៖ លុបចេញពី CateringItem 
    await prisma.cateringItem.deleteMany({
      where: { eventTypeId: id }
    });

    // បើប្អូនមានតារាងផ្សេងទៀតដែលជាប់ពាក់ព័ន្ធ ត្រូវលុបវាចេញដូចខាងលើដែរ

    // 🔥 ជំហានទី២: បន្ទាប់មកទើបលុប Event Type នេះជាចុងក្រោយ
    const deletedItem = await prisma.eventType.delete({
      where: { id }
    });

    return NextResponse.json({ 
      success: true, 
      message: "លុបបានជោគជ័យ", 
      data: deletedItem 
    });
  } catch (error: any) {
    console.error("Delete Error:", error.message);
    return NextResponse.json(
      { 
        success: false, 
        error: "មិនអាចលុបបានទេ! ប្រហែលមកពីទិន្នន័យនេះជាប់ពាក់ព័ន្ធនឹងតារាងផ្សេងទៀតដែលមិនទាន់បានលុបចោល។" 
      }, 
      { status: 500 }
    );
  }
}