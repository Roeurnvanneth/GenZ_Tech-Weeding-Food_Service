import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";

/* ================= GET ONE ================= */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );
    }

    const data = await prisma.cateringStandard.findUnique({
      where: { id: numericId },
      include: {
        eventType: true,
        items: {
          include: { menuItem: true },
        },
      },
    });

    if (!data) {
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { success: false, message: "GET failed" },
      { status: 500 }
    );
  }
}

/* ================= UPDATE ================= */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );
    }

    const existing = await prisma.cateringStandard.findUnique({
      where: { id: numericId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    }

    const formData = await req.formData();

    const catering_standard_name_en = formData.get("catering_standard_name_en") as string;
    const catering_standard_name_kh = formData.get("catering_standard_name_kh") as string;
    const description = formData.get("description") as string;
    const is_special = formData.get("is_special") === "true";
    const imageFile = formData.get("cover_image") as File | null;
    const menu_items = JSON.parse(
      (formData.get("menu_items") as string) || "[]"
    );

    if (!catering_standard_name_en) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    let cover_image = existing.cover_image;

    /* ===== Upload new image if provided ===== */
    if (imageFile && imageFile.size > 0) {
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = `data:${imageFile.type};base64,${buffer.toString("base64")}`;
        cover_image = await uploadImage(base64Image, "catering-standards");
        console.log("New image uploaded:", cover_image);
      } catch (uploadError) {
        console.error("Upload error:", uploadError);
        return NextResponse.json(
          { success: false, message: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.cateringStandard.update({
        where: { id: numericId },
        data: {
          catering_standard_name_en,
          catering_standard_name_kh,
          description,
          is_special,
          cover_image,
        },
      });

      // Replace items
      await tx.cateringStandardItem.deleteMany({
        where: { catering_standard_id: numericId },
      });

      if (menu_items.length > 0) {
        await tx.cateringStandardItem.createMany({
          data: menu_items.map((item: any) => ({
            catering_standard_id: numericId,
            menu_item_id: Number(item.menu_item_id),
            price_usd: Number(item.price_usd || 0),
            price_khr: Number(item.price_khr || 0),
          })),
        });
      }

      return result;
    });

    const finalData = await prisma.cateringStandard.findUnique({
      where: { id: numericId },
      include: {
        eventType: true,
        items: {
          include: { menuItem: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: finalData,
      message: "Updated successfully",
    });
  } catch (error) {
    console.error("PUT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Update failed" },
      { status: 500 }
    );
  }
}

/* ================= DELETE ================= */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );
    }

    // Delete items first
    await prisma.cateringStandardItem.deleteMany({
      where: { catering_standard_id: numericId },
    });

    // Delete the standard
    await prisma.cateringStandard.delete({
      where: { id: numericId },
    });

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Delete failed" },
      { status: 500 }
    );
  }
}