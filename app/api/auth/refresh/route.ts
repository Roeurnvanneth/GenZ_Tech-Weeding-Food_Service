import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json({ success: false, error: "Missing token" }, { status: 400 });
    }

    // 1. Verify Token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { userId: number };

    // 2. Database Lookup (Ensure you use the global prisma instance from /lib/prisma)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, refreshToken: true } // Only select what you need for speed
    });

    // 3. Security Check
    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    // 4. Generate New Pair (Access + Refresh)
    const newAccessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1m" } // 1m might be too short, causing too many refreshes
    );

    const newRefreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );

    // 5. Update DB and Response Cookies
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    const response = NextResponse.json({
      success: true,
      accessToken: newAccessToken,
    });

    // Set the new refresh token in an HTTP-only cookie for better security
    response.cookies.set("token", newAccessToken, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 15, // matches access token
    });

    return response;

  } catch (error) {
    return NextResponse.json({ success: false, error: "Session expired" }, { status: 403 });
  }
}