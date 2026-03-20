import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required to logout" },
        { status: 400 }
      );
    }

    // 1. Remove the refreshToken from the database
    // This effectively "kills" the session
    await prisma.user.update({
      where: { id: Number(userId) },
      data: { refreshToken: null },
    });

    return NextResponse.json({
      success: true,
      message: "Logged out successfully. Token cleared."
    }, { status: 200 });

  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to logout" },
      { status: 500 }
    );
  }
}