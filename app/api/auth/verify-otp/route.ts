import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Get body
    const body = await req.json();
    const { phone, otp } = body;

    // 2. Validate input
    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone and OTP required" },
        { status: 400 }
      );
    }

    // 3. TODO: Verify OTP (compare with DB or in-memory store)
    // const validOtp = await prisma.otp.findUnique({ where: { phone } });
    // if (!validOtp || validOtp.otp !== otp) {
    //   return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    // }

    // 4. For testing, we assume OTP is always valid

    // 5. Return success
    return NextResponse.json({
      message: "OTP verified successfully",
      phone,
    });

  } catch (error) { 
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
 


