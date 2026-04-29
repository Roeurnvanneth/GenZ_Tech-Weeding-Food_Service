import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, name } = body;

    // =========================
    // 1. VALIDATION
    // =========================
    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone is required" },
        { status: 400 }
      );
    }

    // =========================
    // 2. ADMIN CONFIG
    // =========================
    const ADMIN_PHONE = "012345678";

    // =========================
    // 3. FIND USER FIRST
    // =========================
    let user = await prisma.user.findUnique({
      where: { phone },
    });

    // =========================
    // 4. AUTO REGISTER IF NOT EXISTS
    // =========================
    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          name: name || "New User",
          role: phone === ADMIN_PHONE ? "ADMIN" : "USER",
        },
      });
    }

    // =========================
    // 5. ENSURE ROLE IS ALWAYS SAFE
    // =========================
    if (user.role !== "ADMIN") {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: "USER" },
      });
    }

    // =========================
    // 6. CREATE JWT TOKENS
    // =========================
    const accessToken = jwt.sign(
      {
        userId: user.id,
        phone: user.phone,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "30d" }
    );

    // =========================
    // 7. SAVE REFRESH TOKEN (DB ONLY)
    // =========================
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // =========================
    // 8. SAFE RESPONSE (NO SECRET LEAK)
    // =========================
    const { refreshToken: _, ...safeUser } = user;

    return NextResponse.json(
      {
        success: true,
        message:
          user.role === "ADMIN"
            ? "Welcome Admin"
            : "Login successful",
        data: {
          user: safeUser,
          accessToken,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("AUTH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Authentication failed",
      },
      { status: 500 }
    );
  }
}