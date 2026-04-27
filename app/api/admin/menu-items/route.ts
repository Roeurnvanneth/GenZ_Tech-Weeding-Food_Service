import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ================= GET ALL ================= */
export async function GET() {
  try {
    const data = await prisma.menuItem.findMany({
      include: {
        gallery: true,
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Fetch failed" },
      { status: 500 }
    );
  }
}

/* ================= CREATE ================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      menu_item_name_en,
      menu_item_name_kh,
      cover_image,
      gallery_images, // array of URLs from Cloudinary
    } = body;

    if (!menu_item_name_en || !menu_item_name_kh) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    const newItem = await prisma.menuItem.create({
      data: {
        menu_item_name_en,
        menu_item_name_kh,
        cover_image,

        gallery: {
          create:
            gallery_images?.map((img: string) => ({
              image: img,
            })) || [],
        },
      },
      include: { gallery: true },
    });

    return NextResponse.json({ success: true, data: newItem });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Create failed" },
      { status: 500 }
    );
  }
}