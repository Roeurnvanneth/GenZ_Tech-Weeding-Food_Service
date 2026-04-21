import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // ត្រូវប្រាកដថាអ្នកបាន export prisma client

// GET: ទាញយកកន្ត្រករបស់ User
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  const cart = await prisma.cart.findFirst({
    where: { userId: Number(userId) },
    include: { items: { include: { menuPricing: true } } }
  });

  return NextResponse.json(cart);
}

// POST: បន្ថែម Item ចូល Cart
export async function POST(req: Request) {
  const { userId, menuPricingId, quantity, price } = await req.json();

  let cart = await prisma.cart.findFirst({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  const newItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      menu_pricing_id: menuPricingId,
      quantity,
      price
    }
  });

  return NextResponse.json(newItem);
}