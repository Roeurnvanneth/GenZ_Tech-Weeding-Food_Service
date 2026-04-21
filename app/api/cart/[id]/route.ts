import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE: លុប Item ចេញពី Cart
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const cartItemId = parseInt(params.id);

  try {
    await prisma.cartItem.delete({
      where: { id: cartItemId }
    });

    return NextResponse.json({ message: "Item removed successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}