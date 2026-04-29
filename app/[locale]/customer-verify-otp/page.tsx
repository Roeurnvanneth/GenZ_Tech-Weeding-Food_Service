"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation"; 
import { useState, useEffect, useCallback } from "react";

export default function VerifyOTP() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  
  const phone = searchParams.get("phone");
  const autoCode = searchParams.get("code"); // Grab code if passed in URL
  const locale = params.lang || "kh"; 
  
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = useCallback(async (inputOtp: string) => {
    if (inputOtp.length !== 6 || isVerifying) return;
    
    setIsVerifying(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: inputOtp }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // 1. Instant Save
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // 2. Instant Header Update Signal
        window.dispatchEvent(new Event("local-storage-update"));

        // 3. Instant Navigation (No white screen refresh)
        router.replace(`/${locale}/`);
      } else {
        alert("❌ លេខកូដមិនត្រឹមត្រូវ");
        setOtp("");
        setIsVerifying(false);
      }
    } catch (error) {
      console.error("Auth Error:", error);
      setIsVerifying(false);
    }
  }, [phone, locale, isVerifying, router]);

  // AUTO-SUBMIT: When 6th digit is typed, don't wait for a button click
  useEffect(() => {
    if (otp.length === 6) {
      handleVerify(otp);
    }
  }, [otp, handleVerify]);

  // AUTO-FILL: If the code is in the URL (for testing or auto-reading SMS)
  useEffect(() => {
    if (autoCode && autoCode.length === 6) {
      setOtp(autoCode);
    }
  }, [autoCode]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-sm p-6 text-center">
        <h2 className="text-2xl font-bold mb-4 text-black">ផ្ទៀងផ្ទាត់</h2>
        <input 
          type="text"
          maxLength={6}
          value={otp} 
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="w-full text-black text-center text-4xl font-black border-b-2 border-[#B48C00] outline-none py-2 tracking-widest"
          autoFocus
          disabled={isVerifying}
        />
        {isVerifying && <p className="mt-4 text-[#B48C00] animate-pulse">កំពុងផ្ទៀងផ្ទាត់...</p>}
      </div>
    </div>
  );
}