import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { prisma } from "@/lib/prisma"; // ត្រូវប្រាកដថាអ្នកមាន Prisma setup

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ success: false, message: "សូមបញ្ចូលលេខទូរស័ព្ទ" }, { status: 400 });
    }

    // ១. ស្វែងរក User ក្នុង Database ដើម្បីយក Role
    const user = await prisma.user.findUnique({
      where: { phone: phone }
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "រកមិនឃើញអ្នកប្រើប្រាស់នេះទេ" }, { status: 404 });
    }

    // ២. បង្កើតលេខ OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // ៣. ផ្ញើ SMS (Twilio)
    try {
      if (process.env.TWILIO_PHONE_NUMBER && accountSid && authToken) {
        await client.messages.create({
          body: `Your OTP is: ${generatedOtp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone,
        });
      }
    } catch (smsError) {
      console.log("SMS Send failed (Twilio not configured), but continuing for testing...");
    }

    // ៤. បង្កើត Response និង Set Cookies
    const response = NextResponse.json({
      success: true,
      message: "OTP generated!",
      debugOtp: generatedOtp 
    });

    // បោះ Token សន្មត (ប្តូរចេញពេលអ្នកធ្វើប្រព័ន្ធ Login ចប់សព្វគ្រប់)
    response.cookies.set("token", "test_session_token", {
      httpOnly: true,
      path: "/",
    });

    // បោះ Role ទៅឱ្យ Middleware ឆែក
    response.cookies.set("user_role", user.role, {
      path: "/",
      maxAge: 60 * 60 * 24, // ១ ថ្ងៃ
    });

    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}