import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, name, idToken } = body;

    // 1. Validation: Ensure we have the minimum data
    if (!phone || !idToken) {
      return NextResponse.json(
        { success: false, error: "Phone number and verification token are required" },
        { status: 400 }
      );
    }

    // 2. Define Admin Phone (Change this to your real phone number)
    const ADMIN_PHONE = "012345678";

    // 3. UPSERT: If user exists, update them. If not, create them.
    // This handles both Login and Registration in one step.
    const user = await prisma.user.upsert({
      where: { phone: phone },
      update: { 
        name: name || undefined, // Update name only if provided
        role: phone === ADMIN_PHONE ? "ADMIN" : undefined 
      },
      create: {
        phone: phone,
        name: name || "New Customer",
        role: phone === ADMIN_PHONE ? "ADMIN" : "USER",
      },
    });

    // 4. Create JWT Tokens
    // Access Token: Short-lived (e.g., for API calls)
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "your_access_secret_123",
      { expiresIn: "7d" }
    );

    // Refresh Token: Long-lived (to keep user logged in)
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET || "your_refresh_secret_456",
      { expiresIn: "30d" }
    );

    // 5. Save the refresh token to the database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // 6. Return response (Don't send the secret refresh token in the 'user' object)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { refreshToken: _, ...safeUserData } = updatedUser;

    return NextResponse.json({
      success: true,
      message: safeUserData.role === "ADMIN" ? "Welcome Admin!" : "Login successful",
      data: {
        user: safeUserData,
        accessToken,
        refreshToken,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed", details: error.message },
      { status: 500 }
    );
  }
}