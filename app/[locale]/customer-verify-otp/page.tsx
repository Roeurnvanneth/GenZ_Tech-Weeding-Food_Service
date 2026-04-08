"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation"; 
import { useState, useEffect, useCallback } from "react";

export default function VerifyOTP() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  
  // ទាញយកព័ត៌មានពី URL
  const phone = searchParams.get("phone");
  const autoCode = searchParams.get("code");
  const nameFromURL = searchParams.get("name"); // ឈ្មោះដែលផ្ញើមកពីទំព័រ Login
  const locale = params.lang || "kh"; 
  
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // --- មុខងារផ្ទៀងផ្ទាត់ OTP ---
  const handleVerify = useCallback(async (inputOtp: string) => {
    // បើលេខកូដមិនគ្រប់ ៦ ខ្ទង់ ឬកំពុងផ្ទៀងផ្ទាត់ មិនឱ្យដំណើរការទេ
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
        // ១. រក្សាទុក Token សុវត្ថិភាព
        localStorage.setItem("token", data.token);

        // ២. រក្សាទុក Object User ដើម្បីបង្ហាញក្នុង Header Profile (សំខាន់បំផុត)
        const userProfile = {
          name: nameFromURL || "User", // បើគ្មានឈ្មោះប្រើពាក្យ User ជំនួស
          phone: phone,
          joinedAt: new Date().toISOString()
        };
        localStorage.setItem("user", JSON.stringify(userProfile));

        // ៣. បញ្ជូនទៅកាន់ទំព័រដើមវិញ
        // ប្រើ window.location.href ដើម្បីឱ្យ Browser Refresh និងចាប់យក localStorage ថ្មីក្នុង Header
        window.location.href = `/${locale}/`; 
      } else {
        alert("❌ លេខកូដ OTP មិនត្រឹមត្រូវ ឬហួសសុពលភាព");
        setOtp(""); // លុបលេខកូដចាស់ចេញ
      }
    } catch (error) {
      alert("⚠️ មានបញ្ហាការភ្ជាប់បណ្តាញ។ សូមព្យាយាមម្តងទៀត។");
    } finally {
      setIsVerifying(false);
    }
  }, [phone, locale, nameFromURL, isVerifying]);

  // Handle Auto-fill: បើមានលេខកូដក្នុង URL វានឹងបំពេញ និង Verify ឱ្យភ្លាម
  useEffect(() => {
    if (autoCode && autoCode.length === 6) {
      setOtp(autoCode);
      const timer = setTimeout(() => {
        handleVerify(autoCode);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [autoCode, handleVerify]);

  // បើ User វាយគ្រប់ ៦ ខ្ទង់ វានឹង Verify ដោយស្វ័យប្រវត្តិ
  useEffect(() => {
    if (otp.length === 6 && !isVerifying) {
      handleVerify(otp);
    }
  }, [otp, handleVerify, isVerifying]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 font-sans text-black">
      <div className="w-full max-w-md rounded-[2.5rem] bg-white p-10 shadow-2xl text-center border border-slate-100">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-yellow-50 p-4">
             <svg className="h-10 w-10 text-[#B48C00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
             </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">ផ្ទៀងផ្ទាត់លេខកូដ</h1>
        <p className="mt-2 text-sm text-slate-500">
          លេខកូដបានផ្ញើទៅកាន់: <span className="font-bold text-[#B48C00]">{phone}</span>
        </p>
        
        <div className="relative">
          <input 
            type="text"
            maxLength={6}
            value={otp} 
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // ឱ្យវាយតែលេខ
            placeholder="000000"
            className="my-8 w-full border-b-4 border-slate-100 p-4 text-center text-5xl font-black tracking-[0.8rem] text-slate-800 outline-none focus:border-[#B48C00] transition-all"
            autoFocus
            disabled={isVerifying}
          />
          {isVerifying && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50">
               <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#B48C00] border-t-transparent"></div>
            </div>
          )}
        </div>

        <button 
          onClick={() => handleVerify(otp)} 
          disabled={isVerifying || otp.length < 6}
          className="w-full rounded-2xl bg-[#B48C00] py-4 text-lg font-bold text-white shadow-lg shadow-yellow-900/20 transition-all hover:bg-yellow-700 active:scale-95 disabled:opacity-50"
        >
          {isVerifying ? "កំពុងផ្ទៀងផ្ទាត់..." : "យល់ព្រម"}
        </button>

        <p className="mt-8 text-xs text-slate-400">
          មិនទាន់ទទួលបានលេខកូដ? <button className="font-bold text-[#B48C00] hover:underline">ផ្ញើឡើងវិញ</button>
        </p>
      </div>
    </div>
  );
}