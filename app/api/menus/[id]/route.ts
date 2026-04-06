import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ១. កែប្រែ PATCH (Update)
export async function PATCH(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } // ប្រាប់ Next.js ថា params ជា Promise
) {
  try {
    // បន្ថែម await នៅទីនេះ (ចំណុចដែល error មុននេះ)
    const { id: rawId } = await params; 
    const id = parseInt(rawId);

    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "ID មិនត្រឹមត្រូវ" }, { status: 400 });
    }

    const body = await request.json();

    const updatedMenu = await prisma.menu.update({
      where: { id },
      data: {
        menu_name: body.menu_name,
        price_usd: parseFloat(body.price_usd),
        price_khr: parseFloat(body.price_usd) * 4100,
        categoryId: parseInt(body.categoryId),
        status: body.status,
      },
    });

    return NextResponse.json({ success: true, data: updatedMenu });
  } catch (error: any) {
    console.error("❌ Update Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ២. កែប្រែ DELETE
export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } // ប្រើ Promise ដូចគ្នា
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);

    await prisma.menu.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "លុបបានជោគជ័យ" });
  } catch (error: any) {
    console.error("❌ Delete Error:", error);
    return NextResponse.json({ success: false, message: "មិនអាចលុបបានទេ" }, { status: 500 });
  }
}