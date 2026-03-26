"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function VerifyOTP() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const phone = searchParams.get("phone");
  const autoCode = searchParams.get("code"); // ចាប់យកលេខកូដដែលបញ្ជូនមកពីទំព័រ Login
  
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // --- បំពេញលេខកូដអូតូ (Auto-fill) ---
  useEffect(() => {
    if (autoCode && autoCode.length === 6) {
      setOtp(autoCode);
      // រង់ចាំបន្តិច រួចធ្វើការផ្ទៀងផ្ទាត់អូតូតែម្តង
      const timer = setTimeout(() => {
        handleVerify(autoCode);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [autoCode]);

  const handleVerify = async (inputOtp: string) => {
    if (inputOtp.length < 6) return;
    
    setIsVerifying(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: inputOtp }),
      });

      if (res.ok) {
        alert("✅ ចូលប្រើប្រាស់ជោគជ័យ!");
        router.push("/dashboard"); 
      } else {
        alert("❌ លេខកូដមិនត្រឹមត្រូវ");
      }
    } catch (error) {
      alert("មានបញ្ហាការភ្ជាប់");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-[2.5rem] bg-white p-10 shadow-2xl text-center border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">ផ្ទៀងផ្ទាត់លេខកូដ</h1>
        <p className="mt-2 text-sm text-slate-500">
          លេខកូដបានផ្ញើទៅកាន់: <span className="font-bold text-[#B48C00]">{phone}</span>
        </p>
        
        {/* ប្រអប់បញ្ចូលលេខកូដ ធំៗច្បាស់ៗ */}
        <input 
          type="text"
          maxLength={6}
          value={otp} 
          onChange={(e) => setOtp(e.target.value)} 
          placeholder="000000"
          className="my-8 w-full border-b-4 border-slate-100 p-4 text-center text-5xl font-black tracking-[1rem] text-slate-800 outline-none focus:border-[#B48C00] transition-all"
          autoFocus
        />

        <button 
          onClick={() => handleVerify(otp)} 
          disabled={isVerifying}
          className="w-full rounded-2xl bg-[#B48C00] py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-yellow-700 active:scale-95 disabled:opacity-50"
        >
          {isVerifying ? "កំពុងផ្ទៀងផ្ទាត់..." : "យល់ព្រម"}
        </button>

        {autoCode && (
          <div className="mt-6 p-3 bg-green-50 rounded-xl border border-green-100">
            <p className="text-xs font-semibold text-green-600 animate-pulse">
              ✨ ប្រព័ន្ធបានរកឃើញលេខកូដ {autoCode} ហើយកំពុងបំពេញជូន...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}