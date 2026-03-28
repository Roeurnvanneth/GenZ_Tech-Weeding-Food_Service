"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation"; 
import { useState, useEffect, useCallback } from "react";

export default function VerifyOTP() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { locale } = useParams(); 
  
  const phone = searchParams.get("phone");
  const autoCode = searchParams.get("code");
  
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Use useCallback to keep the function stable
  const handleVerify = useCallback(async (inputOtp: string) => {
    // Prevent verify if already running or if code is incomplete
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
        // 1. Save Credentials
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", "USER");

        // 2. Redirect to localized homepage (e.g., /kh/ or /en/)
        router.push(`/${locale}/`); 
      } else {
        // Only alert if the response explicitly failed
        alert("❌ លេខកូដមិនត្រឹមត្រូវ");
        setOtp(""); // Clear input on error
      }
    } catch (error) {
      alert("មានបញ្ហាការភ្ជាប់");
    } finally {
      setIsVerifying(false);
    }
  }, [phone, locale, router, isVerifying]);

  // Handle Auto-fill from URL
  useEffect(() => {
    if (autoCode && autoCode.length === 6) {
      setOtp(autoCode);
      const timer = setTimeout(() => {
        handleVerify(autoCode);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoCode, handleVerify]);

  // Handle manual typing - Automatically verify when 6 digits are reached
  useEffect(() => {
    if (otp.length === 6 && !isVerifying) {
      handleVerify(otp);
    }
  }, [otp, handleVerify, isVerifying]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-md rounded-[2.5rem] bg-white p-10 shadow-2xl text-center border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">ផ្ទៀងផ្ទាត់លេខកូដ</h1>
        <p className="mt-2 text-sm text-slate-500">
          លេខកូដបានផ្ញើទៅកាន់: <span className="font-bold text-[#B48C00]">{phone}</span>
        </p>
        
        <input 
          type="text"
          maxLength={6}
          value={otp} 
          onChange={(e) => setOtp(e.target.value)} 
          placeholder="000000"
          className="my-8 w-full border-b-4 border-slate-100 p-4 text-center text-5xl font-black tracking-[1rem] text-slate-800 outline-none focus:border-[#B48C00] transition-all"
          autoFocus
          disabled={isVerifying}
        />

        <button 
          onClick={() => handleVerify(otp)} 
          disabled={isVerifying || otp.length < 6}
          className="w-full rounded-2xl bg-[#B48C00] py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-yellow-700 active:scale-95 disabled:opacity-50"
        >
          {isVerifying ? "កំពុងផ្ទៀងផ្ទាត់..." : "យល់ព្រម"}
        </button>

        {autoCode && otp === autoCode && !isVerifying && (
          <div className="mt-6 p-3 bg-green-50 rounded-xl border border-green-100">
            <p className="text-xs font-semibold text-green-600 animate-pulse">
              ✨ ប្រព័ន្ធរកឃើញលេខកូដ {autoCode} ហើយកំពុងបំពេញជូន...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}