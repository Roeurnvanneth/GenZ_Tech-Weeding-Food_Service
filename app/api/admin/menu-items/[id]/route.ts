import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ================= GET ONE ================= */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const itemId = Number(id);

    const data = await prisma.menuItem.findUnique({
      where: { id: itemId },
      include: { gallery: true },
    });

    if (!data) {
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
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
    const itemId = Number(id);

    const body = await req.json();

    const {
      menu_item_name_en,
      menu_item_name_kh,
      cover_image,
      gallery_images,
    } = body;

    const updated = await prisma.$transaction(async (tx) => {
      const item = await tx.menuItem.update({
        where: { id: itemId },
        data: {
          menu_item_name_en,
          menu_item_name_kh,
          cover_image,
        },
      });

      // delete old gallery
      await tx.menuItemGallery.deleteMany({
        where: { menu_item_id: itemId },
      });

      // create new gallery
      if (gallery_images?.length) {
        await tx.menuItemGallery.createMany({
          data: gallery_images.map((img: string) => ({
            menu_item_id: itemId,
            image: img,
          })),
        });
      }

      return item;
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
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
    const itemId = Number(id);

    await prisma.menuItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Delete failed" },
      { status: 500 }
    );
  }
}