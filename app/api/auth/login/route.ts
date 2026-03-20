import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone } = body;

    // 1. Basic Validation
    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Name and phone are required" },
        { status: 400 }
      );
    }

    // 2. Define Admin Phone
    const ADMIN_PHONE = "012345678";

    // 3. THE FIX: Use UPSERT instead of findFirst
    // If phone exists: It updates the name (Login)
    // If phone is new: It creates the record (Auto-Register)
    const user = await prisma.user.upsert({
      where: { phone: phone },
      update: { 
        name: name,
        role: phone === ADMIN_PHONE ? "ADMIN" : undefined 
      },
      create: {
        name: name,
        phone: phone,
        role: phone === ADMIN_PHONE ? "ADMIN" : "USER",
      },
    });

    // 4. Create JWT tokens
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    // 5. Update the user with the new refreshToken
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // 6. Return the success response
    const { refreshToken: _, ...userData } = updatedUser;

    return NextResponse.json({
      success: true,
      message: userData.role === "ADMIN" ? "Welcome Admin!" : "Login successful",
      data: {
        user: userData,
        accessToken,
        refreshToken,
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}