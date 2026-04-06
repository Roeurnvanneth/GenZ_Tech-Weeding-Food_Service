import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 🟠 PATCH: កែប្រែទិន្នន័យ Catering
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { menuIds, eventTypeId, ...otherData } = body;

    const updated = await prisma.catering.update({
      where: { id },
      data: {
        ...otherData,
        // បើមានការដូរមុខម្ហូប ត្រូវសម្អាតអា舊ចោល រួចដាក់អាថ្មីចូល
        ...(menuIds && {
          menuId: menuIds,
          items: {
            deleteMany: {}, // លុបម្ហូបចាស់ៗក្នុងឈុតនេះចេញ
            create: menuIds.map((mId: number) => ({
              menuId: parseInt(mId.toString()),
              eventTypeId: parseInt(eventTypeId || body.oldEventTypeId)
            }))
          }
        })
      }
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🔴 DELETE: លុប Catering
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    await prisma.catering.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "លុបបានជោគជ័យ" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}