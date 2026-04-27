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

// ================= GET ONE =================
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing ID" },
        { status: 400 }
      );
    }

    const data = await prisma.eventType.findUnique({
      where: { id: Number(id) },
      include: {
        cateringStandards: true,
      },
    });

    if (!data) {
      return NextResponse.json(
        { success: false, message: "Event type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET ONE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch event type" },
      { status: 500 }
    );
  }
}

// ================= UPDATE =================
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing ID" },
        { status: 400 }
      );
    }

    // Check if form-data or JSON
    const contentType = req.headers.get("content-type") || "";
    let event_type_name_en: string;
    let event_type_name_kh: string;
    let cover_image: string | null = null;
    let imageFile: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      event_type_name_en = formData.get("event_type_name_en") as string;
      event_type_name_kh = formData.get("event_type_name_kh") as string;
      imageFile = formData.get("cover_image") as File | null;
      
      // Get existing event to keep current image if no new image
      const existingEvent = await prisma.eventType.findUnique({
        where: { id: Number(id) },
      });
      
      if (!existingEvent) {
        return NextResponse.json(
          { success: false, message: "Event type not found" },
          { status: 404 }
        );
      }
      
      cover_image = existingEvent.cover_image;
      
      // Upload new image if provided
      if (imageFile && imageFile.size > 0) {
        cover_image = await saveImage(imageFile, `event_${id}`);
      }
    } else {
      const body = await req.json();
      event_type_name_en = body.event_type_name_en;
      event_type_name_kh = body.event_type_name_kh;
      cover_image = body.cover_image ?? null;
    }

    if (!event_type_name_en || !event_type_name_kh) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const updated = await prisma.eventType.update({
      where: { id: Number(id) },
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
      data: updated,
      message: "Event type updated successfully"
    });
  } catch (error) {
    console.error("PUT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update event type" },
      { status: 500 }
    );
  }
}

// ================= DELETE =================
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing ID" },
        { status: 400 }
      );
    }

    // Check if event type exists
    const existingEvent = await prisma.eventType.findUnique({
      where: { id: Number(id) },
      include: {
        cateringStandards: true,
      },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, message: "Event type not found" },
        { status: 404 }
      );
    }

    // Check if has related catering standards
    if (existingEvent.cateringStandards.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Cannot delete: Event type has related catering standards" 
        },
        { status: 400 }
      );
    }

    await prisma.eventType.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      success: true,
      message: "Event type deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete event type" },
      { status: 500 }
    );
  }
}