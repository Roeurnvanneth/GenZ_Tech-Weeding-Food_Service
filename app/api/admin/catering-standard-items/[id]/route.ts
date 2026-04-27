import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ================= GET ONE ================= */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );
    }

    const data = await prisma.cateringStandardItem.findUnique({
      where: { id },
      include: {
        cateringStandard: true,
        menuItem: true,
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
    console.error("GET ONE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch" },
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
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { catering_standard_id, menu_item_id, price_usd, price_khr } = body;

    // Validate required fields
    if (!catering_standard_id || !menu_item_id || price_usd === undefined || price_khr === undefined) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const updated = await prisma.cateringStandardItem.update({
      where: { id },
      data: {
        catering_standard_id: Number(catering_standard_id),
        menu_item_id: Number(menu_item_id),
        price_usd: Number(price_usd),
        price_khr: Number(price_khr),
      },
      include: {
        cateringStandard: true,
        menuItem: true,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("UPDATE ERROR:", error);

    // Record not found
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 }
      );
    }

    // Duplicate unique constraint
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "Duplicate relation already exists" },
        { status: 400 }
      );
    }

    // Foreign key violation (invalid catering_standard_id or menu_item_id)
    if (error.code === "P2003") {
      return NextResponse.json(
        { success: false, message: "Invalid catering standard or menu item ID" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update" },
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
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );
    }

    // Check if record exists before deleting
    const existing = await prisma.cateringStandardItem.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 }
      );
    }

    await prisma.cateringStandardItem.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE ERROR:", error);

    // Record not found (race condition)
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 }
      );
    }

    // Foreign key constraint — item referenced in another table
    if (error.code === "P2003") {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot delete: this item is referenced in another table",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to delete" },
      { status: 500 }
    );
  }
}