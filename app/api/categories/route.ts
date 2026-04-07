import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust this path to your prisma client location

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      // Sort them by ID so 'ALL' (ID 1) stays at the top
      orderBy: {
        id: 'asc',
      },
      // Optional: uncomment the line below if you want to load products too
      // include: { products: true } 
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}