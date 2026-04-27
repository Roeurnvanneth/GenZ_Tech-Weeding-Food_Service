import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET ALL GALLERY IMAGES
export async function GET() {
  try {
    const data = await prisma.menuItemGallery.findMany({
      include: {
        menuItem: true,
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch gallery" },
      { status: 500 }
    );
  }
}

// CREATE GALLERY IMAGE
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { menu_item_id, image } = body;

    if (!menu_item_id || !image) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newImage = await prisma.menuItemGallery.create({
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
      data: newImage,
      message: "Image created successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to create gallery image" },
      { status: 500 }
    );
  }
}