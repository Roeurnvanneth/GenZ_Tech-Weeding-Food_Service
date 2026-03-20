import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { refreshToken } = await request.json();

    // 1. Check if token is provided
    if (!refreshToken) {
      return NextResponse.json({ success: false, error: "Refresh token is required" }, { status: 400 });
    }

    // 2. Verify the Refresh Token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { userId: number };

    // 3. Find the user and check if the token matches what we have in the DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json({ success: false, error: "Invalid refresh token" }, { status: 401 });
    }

    // 4. Generate a NEW Access Token
    const newAccessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" } // Access tokens should be short-lived
    );

    // 5. (Optional) Generate a NEW Refresh Token (Token Rotation)
    const newRefreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    // Update the database with the new refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return NextResponse.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });

  } catch (error) {
    console.error("Refresh Error:", error);
    return NextResponse.json({ success: false, error: "Token expired or invalid" }, { status: 403 });
  }
}