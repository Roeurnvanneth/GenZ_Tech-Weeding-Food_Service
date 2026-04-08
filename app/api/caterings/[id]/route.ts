import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 🟠 PATCH: កែប្រែទិន្នន័យ Catering
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    // បំបែក data ចេញពី menuIds និង eventTypeId
    const { menuIds, eventTypeId, ...otherData } = body;

    // លុប field 'id' ចេញពី data ដើម្បីកុំឱ្យ Prisma ច្រឡំថាប្អូនចង់ update primary key
    if ('id' in otherData) delete (otherData as any).id;

    const updatedCatering = await prisma.catering.update({
      where: { id },
      data: {
        ...otherData,
        // បើមានការបញ្ជូន menuIds មក ត្រូវធ្វើការ Update រូបមន្តម្ហូប
        ...(menuIds && Array.isArray(menuIds) && {
          menuId: menuIds, // Update field JSON ក្នុង table catering
          items: {
            deleteMany: {}, // ១. លុបម្ហូបចាស់ៗក្នុង table CateringItem ចោលសិន
            create: menuIds.map((mId: number) => ({ // ២. បង្កើតម្ហូបថ្មីៗចូលវិញ
              menuId: parseInt(mId.toString()),
              eventTypeId: parseInt(eventTypeId.toString())
            }))
          }
        })
      }
    });

    return NextResponse.json({ success: true, data: updatedCatering });
  } catch (error: any) {
    console.error("❌ Update Error:", error.message);
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