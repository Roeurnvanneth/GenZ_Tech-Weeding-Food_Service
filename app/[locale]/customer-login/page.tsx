"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { loginSchema, LoginFormValues } from "./validation"; // ប្រាកដថាអ្នកមាន File validation នេះ

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();
  const params = useParams();
  const locale = params.lang || "kh"; // ទាញយកភាសាពី URL params

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // --- មុខងារផ្ញើ OTP និងបញ្ជូន Name ទៅទំព័របន្ទាប់ ---
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setServerError("");

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: data.phone,
          name: data.name,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // ចាប់យក debugOtp បើមាន (សម្រាប់ Dev mode)
        const otpCode = result.debugOtp ? `&code=${result.debugOtp}` : "";

        /* សំខាន់៖ យើងបញ្ជូន name ទៅជាមួយ URL ដើម្បីឱ្យទំព័រ Verify 
           អាចយកឈ្មោះនោះទៅរក្សាទុកក្នុង localStorage ពេល Login ជោគជ័យ
        */
        router.push(
          `/${locale}/customer-verify-otp?phone=${encodeURIComponent(data.phone)}&name=${encodeURIComponent(data.name)}${otpCode}`,
        );
      } else {
        setServerError(
          result.error || "ការផ្ញើលេខកូដបរាជ័យ។ សូមព្យាយាមម្តងទៀត។",
        );
      }
    } catch (error) {
      setServerError("មានបញ្ហាការភ្ជាប់បណ្តាញ។ សូមពិនិត្យអ៊ីនធឺណិតរបស់អ្នក។");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 md:bg-slate-100 font-sans text-black">
      <div className="flex w-full max-w-5xl flex-col overflow-hidden bg-white shadow-2xl md:flex-row md:rounded-[2rem] md:m-4 min-h-screen md:min-h-[600px]">
        {/* ផ្នែកខាងស្តាំ - រូបភាព (បង្ហាញខាងលើនៅពេលប្រើទូរស័ព្ទ) */}
        <div className="relative h-[35vh] w-full md:h-auto md:w-1/2 md:order-2">
          <img
            src="/bh.jpg"
            alt="Team"
            className="h-full w-full object-cover grayscale-[20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:bg-gradient-to-l"></div>
          <div className="absolute bottom-0 h-10 w-full rounded-t-[2.5rem] bg-white md:hidden"></div>
        </div>

        {/* ផ្នែកខាងឆ្វេង - ទម្រង់បែបបទ Form */}
        <div className="flex w-full flex-col justify-start px-8 py-10 md:w-1/2 md:justify-center md:p-16 md:order-1">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              សូមស្វាគមន៍
            </h2>
            <p className="mt-2 text-slate-500 font-medium italic">
              {locale === "kh"
                ? "បញ្ចូលព័ត៌មានដើម្បីទទួលលេខកូដ OTP"
                : "Enter details to receive OTP code"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* ប្រអប់បញ្ចូលឈ្មោះ */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                ឈ្មោះពេញ
              </label>
              <input
                {...register("name")}
                className={`w-full rounded-xl border ${errors.name ? "border-red-500" : "border-slate-200"} bg-slate-50 p-4 text-slate-900 outline-none focus:ring-2 focus:ring-[#B48C00] transition-all`}
                placeholder="បញ្ចូលឈ្មោះរបស់អ្នក"
              />
              {errors.name && (
                <p className="mt-1.5 text-xs font-semibold text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* ប្រអប់បញ្ចូលលេខទូរស័ព្ទ */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                លេខទូរស័ព្ទ
              </label>
              <input
                {...register("phone")}
                type="tel"
                className={`w-full rounded-xl border ${errors.phone ? "border-red-500" : "border-slate-200"} bg-slate-50 p-4 text-slate-900 outline-none focus:ring-2 focus:ring-[#B48C00] transition-all`}
                placeholder="+855 xxx xxx xxx"
              />
              {errors.phone && (
                <p className="mt-1.5 text-xs font-semibold text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* បង្ហាញ Error ពី Server */}
            {serverError && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold text-center animate-shake">
                {serverError}
              </div>
            )}

            {/* ប៊ូតុងបញ្ជូន */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative mt-4 w-full rounded-xl bg-[#B48C00] py-4 text-lg font-bold text-white shadow-xl hover:bg-[#967500] active:scale-[0.97] transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  កំពុងផ្ញើ...
                </span>
              ) : locale === "kh" ? (
                "បន្ទាប់"
              ) : (
                "Next"
              )}
            </button>
          </form>

          <div className="mt-10 border-t border-slate-100 pt-6">
            <p className="text-center text-xs text-slate-400">
              © 2026{" "}
              <span className="font-bold text-slate-500">GenZ Catering</span>.
              រក្សាសិទ្ធិគ្រប់យ៉ាង។
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
