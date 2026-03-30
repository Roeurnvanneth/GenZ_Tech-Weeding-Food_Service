import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { phone, otp, name } = await req.json();

    // 1. Define your Admin Number
    const ADMIN_PHONE = "012345678"; 

    // 2. Upsert User
    const user = await prisma.user.upsert({
      where: { phone: phone },
      update: { role: phone === ADMIN_PHONE ? "ADMIN" : undefined },
      create: {
        phone: phone,
        name: name || "Customer",
        role: phone === ADMIN_PHONE ? "ADMIN" : "USER",
      },
    });

    const response = NextResponse.json({
      success: true,
      role: user.role,
      user
    });

    // 3. CRITICAL: Set the role in a Cookie so Middleware can see it
    response.cookies.set("user_role", user.role, {
      httpOnly: false, // Set to false so frontend can also read it if needed
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}