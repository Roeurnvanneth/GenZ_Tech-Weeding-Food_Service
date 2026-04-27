import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";

/* ================= GET ALL ================= */
export async function GET() {
  try {
    const data = await prisma.cateringStandard.findMany({
      include: {
        eventType: true,
        items: {
          include: { menuItem: true },
        },
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

/* ================= CREATE ================= */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const event_type_id = formData.get("event_type_id") as string;
    const catering_standard_name_en = formData.get("catering_standard_name_en") as string;
    const catering_standard_name_kh = formData.get("catering_standard_name_kh") as string;
    const description = formData.get("description") as string;
    const is_special = formData.get("is_special") === "true";
    const imageFile = formData.get("cover_image") as File | null;
    const menu_items = JSON.parse(
      (formData.get("menu_items") as string) || "[]"
    );

    if (!event_type_id || !catering_standard_name_en) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    let cover_image: string | null = null;

    /* ===== Upload Image to Cloudinary ===== */
    if (imageFile && imageFile.size > 0) {
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = `data:${imageFile.type};base64,${buffer.toString("base64")}`;
        cover_image = await uploadImage(base64Image, "catering-standards");
        console.log("Image uploaded:", cover_image);
      } catch (uploadError) {
        console.error("Upload error:", uploadError);
        return NextResponse.json(
          { success: false, message: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const standard = await tx.cateringStandard.create({
        data: {
          event_type_id: Number(event_type_id),
          catering_standard_name_en,
          catering_standard_name_kh,
          description,
          is_special,
          cover_image,
        },
      });

      if (menu_items.length > 0) {
        await tx.cateringStandardItem.createMany({
          data: menu_items.map((item: any) => ({
            catering_standard_id: standard.id,
            menu_item_id: Number(item.menu_item_id),
            price_usd: Number(item.price_usd || 0),
            price_khr: Number(item.price_khr || 0),
          })),
        });
      }

      return standard;
    });

    const finalData = await prisma.cateringStandard.findUnique({
      where: { id: result.id },
      include: {
        eventType: true,
        items: {
          include: { menuItem: true },
        },
      },
    });

    return NextResponse.json(
      { success: true, data: finalData, message: "Created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create" },
      { status: 500 }
    );
  }
}