import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { phone,otp } = await req.json();

    // ១. ស្វែងរក User ក្នុង Database
    const user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // ២. បង្កើត Response
    const response = NextResponse.json({
      success: true,
      role: user.role, // នឹងបោះតម្លៃ "ADMIN"
      user
    });

    // ៣. CRITICAL: Set Cookies ឱ្យ Middleware ស្គាល់
    // បើគ្មាន Token ទេ Middleware នឹងគិតថាអ្នកមិនទាន់ Login
    response.cookies.set("token", "your_jwt_session_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // បើគ្មាន user_role ទេ Middleware នឹងរុញទៅទំព័រ Home
    response.cookies.set("user_role", user.role, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}