import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      include: { category: true },
      orderBy: { id: "desc" },
    });
    return NextResponse.json({ success: true, data: menus });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // ប្រើ formData ជានិច្ចដើម្បីបញ្ជៀស JSON Syntax Error ពេល Upload File
    const formData = await req.formData();
    
    const menu_name = formData.get("menu_name") as string;
    const price_usd = parseFloat(formData.get("price_usd") as string) || 0;
    const categoryId = parseInt(formData.get("categoryId") as string);
    const status = formData.get("status") as string || "active";
    const imageFile = formData.get("image") as File | null;

    let fileName = "default-food.jpg"; // តម្លៃដើមតាម Schema

    if (imageFile && typeof imageFile !== "string" && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // បង្កើតឈ្មោះ File ថ្មី
      fileName = `menu_${Date.now()}_${imageFile.name.replace(/\s/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, fileName), buffer);
    }

    const newMenu = await prisma.menu.create({
      data: {
        menu_name,
        image: fileName, // ប្រើ Field 'image' តាម Schema របស់អ្នក
        price_usd: price_usd,
        price_khr: price_usd * 4100,
        categoryId: categoryId,
        status: status,
      },
      include: { category: true }
    });

    return NextResponse.json({ success: true, data: newMenu }, { status: 201 });
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}