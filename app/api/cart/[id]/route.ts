import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE: លុប Item ចេញពី Cart - FIXED for Next.js 15+
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ ប្រើ await ដើម្បីទាញយក id ពី Promise
    const { id } = await params;
    const cartItemId = parseInt(id);

    // ពិនិត្យមើលថា id ត្រឹមត្រូវ
    if (isNaN(cartItemId)) {
      return NextResponse.json(
        { error: "Invalid item ID" },
        { status: 400 }
      );
    }

    // ពិនិត្យមើលថា item មានក្នុង database ដែរឬទេ
    const existingItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId }
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    // លុប item
    await prisma.cartItem.delete({
      where: { id: cartItemId }
    });

    return NextResponse.json({ 
      message: "Item removed successfully",
      success: true 
    });
    
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return NextResponse.json(
      { error: "Failed to remove item" },
      { status: 500 }
    );
  }
}