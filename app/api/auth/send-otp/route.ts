import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { prisma } from "@/lib/prisma";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(request: Request) {
  try {
    const { phone, name } = await request.json();

    if (!phone) {
      return NextResponse.json({ success: false, error: "សូមបញ្ចូលលេខទូរស័ព្ទ" }, { status: 400 });
    }

    // 1. Generate 6-digit OTP and Expiry (5 minutes)
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); 

    // 2. Upsert User (Create if new, Update if exists)
    // This matches your Schema with Int ID and Role enum
    const user = await prisma.user.upsert({
      where: { phone: phone },
      update: { 
        otpCode: generatedOtp,
        otpExpiry: expiry 
      },
      create: {
        phone: phone,
        name: name || "New User",
        otpCode: generatedOtp,
        otpExpiry: expiry,
        role: phone === "012345678" ? "ADMIN" : "USER", // Optional: Set admin by phone
      },
    });

    // 3. Send SMS (Twilio)
    try {
      if (process.env.TWILIO_PHONE_NUMBER && process.env.TWILIO_ACCOUNT_SID) {
        await client.messages.create({
          body: `លេខកូដ OTP របស់អ្នកគឺ: ${generatedOtp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone,
        });
      }
    } catch (smsError) {
      console.log("Twilio not configured, but proceeding for development...");
    }

    // 4. Return success to the frontend
    return NextResponse.json({
      success: true,
      message: "OTP generated successfully",
      debugOtp: generatedOtp // This is what your frontend uses for redirect
    });

  } catch (error: any) {
    console.error("DATABASE_ERROR:", error);
    return NextResponse.json({ success: false, error: "មានបញ្ហាម៉ាស៊ីនបម្រើ" }, { status: 500 });
  }
}