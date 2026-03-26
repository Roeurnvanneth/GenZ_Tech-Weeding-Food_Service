import { NextResponse } from 'next/server';
import twilio from 'twilio';

// កំណត់ Twilio Client (ប្រើសម្រាប់ផ្ញើ SMS ពិតប្រាកដ)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function POST(request: { json: () => PromiseLike<{ phone: any; }> | { phone: any; }; }) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ success: false, message: "សូមបញ្ចូលលេខទូរស័ព្ទ" }, { status: 400 });
    }

    // ១. បង្កើតលេខ OTP ៦ ខ្ទង់ដោយចៃដន្យ
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // // ២. បន្ថែមបន្ទាត់នេះ ដើម្បីឱ្យវាបង្ហាញក្នុង Terminal
    // console.log("-----------------------------------------");
    // console.log(`🚀 [BACKEND] លេខកូដ OTP សម្រាប់ ${phone} គឺ: ${generatedOtp}`);
    // console.log("-----------------------------------------");




    // ៣. ព្យាយាមផ្ញើ SMS (ប្រើ try/catch ដើម្បីកុំឱ្យវាគាំងពេលអត់មាន Twilio Account)
    try {
      if (process.env.TWILIO_PHONE_NUMBER) {
        await client.messages.create({
          body: `Your OTP is: ${generatedOtp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone,
        });
      }
    } catch (smsError) {
      console.log("SMS Send failed (Twilio not configured), but continuing for testing...");
    }

    return NextResponse.json({
      success: true,
      message: "OTP generated! Check your VS Code Terminal to see the code.",
      // ក្នុងពេលតេស្ត អ្នកអាចផ្ញើ OTP ទៅ Client បើចង់បង្ហាញលើ Screen ភ្លាមៗ
      debugOtp: generatedOtp 
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}