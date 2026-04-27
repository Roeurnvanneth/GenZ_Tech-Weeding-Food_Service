import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// UPDATE GALLERY IMAGE
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { menu_item_id, image } = body;

    if (!menu_item_id || !image) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedImage = await prisma.menuItemGallery.update({
      where: { id: Number(id) },
      data: {
        menu_item_id: Number(menu_item_id),
        image: image,
      },
      include: {
        menuItem: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedImage,
      message: "Image updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to update gallery image" },
      { status: 500 }
    );
  }
}

// DELETE GALLERY IMAGE
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Image ID is required" },
        { status: 400 }
      );
    }

    await prisma.menuItemGallery.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to delete image" },
      { status: 500 }
    );
  }
}