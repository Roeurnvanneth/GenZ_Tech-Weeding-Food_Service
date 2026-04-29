"use client";

import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  X,
  Globe,
  LogOut,
  ChevronDown,
  User,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { messages, Language } from "../i18n/messages";
import { useCart } from "../[locale]/context/CartContext";

export default function Header({ lang }: { lang: Language }) {
  const t = messages[lang];
  const { totalItems } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const [userData, setUserData] = useState<{ name: string } | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- 1. THE SPEED FIX: Define a sync function ---
  const syncUser = useCallback(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUserData(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error parsing user data", error);
        }
      } else {
        setUserData(null);
      }
    }
  }, []);

  // --- 2. Listen for the "Login Success" signal ---
  useEffect(() => {
    syncUser(); // Check immediately when component loads

    // Listen for the custom event from the Verify page
    window.addEventListener("local-storage-update", syncUser);
    // Listen for the standard storage event (other tabs)
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("local-storage-update", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, [syncUser]);
  

  const toggleLang = () => {
    const newLang = lang === "en" ? "kh" : "en";
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    router.push(newPath);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUserData(null); // Clear state instantly
    setIsUserMenuOpen(false);
    router.push(`/${lang}`); // Go home smoothly
    router.refresh();
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md h-20 flex items-center border-b border-gray-100 font-sans px-6">
      {/* ... (Rest of your JSX remains exactly the same) ... */}
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center text-black">
        <div className="flex-1 flex items-center italic font-black text-2xl text-[#B48C00]">
          <Link href={`/${lang}`}>
            <img
              src="/logo.jpg"
              alt="Logo"
              className="h-12 w-12 rounded-full object-cover border border-gray-100 cursor-pointer"
            />
          </Link>
        </div>
        <nav className="hidden md:flex flex-[2] justify-center items-center gap-10 text-black font-bold">
          {t.nav.map((item: any, index: number) => ( 
            <Link   
              key={index}
              href={`/${lang}/${item.path}`}  
              className="hover:text-[#B99808] transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex flex-1 items-center justify-end gap-6">
          <button
            onClick={toggleLang}
            className="flex items-center gap-2 text-gray-500 font-bold hover:text-[#B99808] transition-all"
          >
            <Globe size={18} />
            <span className="text-xs uppercase">
              {lang === "kh" ? "ខ្មែរ" : "EN"}
            </span>
          </button>

          <Link
            href={`/${lang}/cart`}
            className="relative p-2.5 bg-gray-50 rounded-full border border-gray-100 hover:bg-gray-100 transition-all group"
          >
            <ShoppingCart
              size={22}
              className="text-[#B48C00] group-hover:scale-110 transition-transform"
            />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white animate-in zoom-in">
                {totalItems}
              </span>
            )}
          </Link>

          {userData ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
         className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border hover:bg-gray-100 transition-all shadow-sm"
              >
                <div className="w-8 h-8 bg-[#B48C00] rounded-full flex items-center justify-center text-white font-bold">
                  {userData.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-bold text-sm">{userData.name}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${isUserMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in duration-200">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 font-bold transition-colors text-sm"
                  >
                    <LogOut size={16} />
                    {lang === "kh" ? "ចាកចេញ" : "Logout"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href={`/${lang}/customer-login`}>
              <button className="bg-[#B48C00] text-white px-7 py-2.5 rounded-full font-bold hover:bg-[#967500] transition-all shadow-md active:scale-95 text-sm uppercase tracking-wide">
                {lang === "kh" ? "ចូលប្រើ" : "Login"}
              </button>
            </Link>
          )}
        </div>

        <button
          className="md:hidden text-[#B99808] p-2 hover:bg-gray-50 rounded-lg transition-all"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>
      {/* ... (Rest of Mobile Menu remains the same) ... */}
    </header>
  );
}