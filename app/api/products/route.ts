import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Importing the database client

/**
 * GET: Fetch a single product by its ID
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      // We convert params.id from a string to a Number because databases usually use numeric IDs
      where: { id: Number(params.id) },
      // "include" acts like a SQL JOIN, fetching the category details linked to this product
      include: { category: true }
    });
    
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    // If the ID doesn't exist or the DB is down, return a 404
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }
}

/**
 * PUT: Update an existing product's information
 */
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json(); // Get the new data from the request body
    
    const updated = await prisma.product.update({
      where: { id: Number(params.id) },
      data: {
        ...data, // Spread the other fields (like name or description)
        // Ensure price and categoryId are Numbers, even if sent as strings from a form
        price: data.price ? Number(data.price) : undefined,
        categoryId: data.categoryId ? Number(data.categoryId) : undefined,
      },
    });
    
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
  }
}

/**
 * DELETE: Remove the product from the database
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({ 
      where: { id: Number(params.id) } 
    });
    
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Delete failed" }, { status: 500 });
  }
}