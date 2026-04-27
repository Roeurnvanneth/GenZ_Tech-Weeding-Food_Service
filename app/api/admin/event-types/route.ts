import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const UPLOAD_DIR = "public/uploads/event-types";

// Helper function to save image
async function saveImage(file: File, prefix: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Create unique filename
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const originalName = file.name;
  const ext = originalName.split(".").pop();
  const filename = `${prefix}_${timestamp}_${random}.${ext}`;
  const filepath = join(process.cwd(), UPLOAD_DIR, filename);
  
  // Ensure upload directory exists
  if (!existsSync(join(process.cwd(), UPLOAD_DIR))) {
    await mkdir(join(process.cwd(), UPLOAD_DIR), { recursive: true });
  }
  
  // Save file
  await writeFile(filepath, buffer);
  
  // Return public URL
  return `/${UPLOAD_DIR}/${filename}`;
}

// ================= GET ALL =================
export async function GET() {
  try {
    const data = await prisma.eventType.findMany({
      include: {
        cateringStandards: true,
      },
      orderBy: { id: "desc" }
    });
    
    return NextResponse.json({ 
      success: true, 
      data 
    });
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch event types" },
      { status: 500 }
    );
  }
}

// ================= CREATE =================
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const event_type_name_en = formData.get("event_type_name_en") as string;
    const event_type_name_kh = formData.get("event_type_name_kh") as string;
    const imageFile = formData.get("cover_image") as File | null;

    // Validation
    if (!event_type_name_en || !event_type_name_kh) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    let cover_image = null;
    
    // Upload image if provided
    if (imageFile && imageFile.size > 0) {
      cover_image = await saveImage(imageFile, "event");
    }

    const newEvent = await prisma.eventType.create({
      data: {
        event_type_name_en,
        event_type_name_kh,
        cover_image,
      },
      include: {
        cateringStandards: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      data: newEvent,
      message: "Event type created successfully"
    });
  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create event type" },
      { status: 500 }
    );
  }
}