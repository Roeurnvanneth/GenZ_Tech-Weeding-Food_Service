import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function PATCH(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id: rawId } = await params; 
    const id = parseInt(rawId);
    const formData = await request.formData();
    
    const menu_name = formData.get("menu_name") as string;
    const price_usd = parseFloat(formData.get("price_usd") as string);
    const categoryId = parseInt(formData.get("categoryId") as string);
    const status = formData.get("status") as string;
    const imageFile = formData.get("image") as File | null;

    const oldMenu = await prisma.menu.findUnique({ where: { id } });
    if (!oldMenu) return NextResponse.json({ success: false, message: "រកមិនឃើញ" }, { status: 404 });

    let fileName = oldMenu.image;

    if (imageFile && typeof imageFile !== "string" && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fileName = `menu_${Date.now()}_${imageFile.name.replace(/\s/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, fileName), buffer);
    }

    const updatedMenu = await prisma.menu.update({
      where: { id },
      data: {
        menu_name,
        price_usd,
        price_khr: price_usd * 4100,
        categoryId,
        status,
        image: fileName,
      },
    });

    return NextResponse.json({ success: true, data: updatedMenu });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    await prisma.menu.delete({ where: { id: parseInt(rawId) } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}