"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, LogOut, ChevronDown, User, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { messages, Language } from '../i18n/messages'; 
import { useCart } from '../[locale]/context/CartContext'; 

interface HeaderProps {
  lang: Language;
  toggleLang: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export default function Header({
  lang,
  toggleLang,
  isMenuOpen,
  setIsMenuOpen
}: HeaderProps) {
  const t = messages[lang];
  const { totalItems } = useCart(); // Extract only totalItems from the cart context
  const [userData, setUserData] = useState<{ name: string } | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // 1. When the component mounts, check localStorage for user data and set it to state
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md h-20 flex items-center border-b border-gray-100 font-sans px-6">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center text-black">
        
        {/* --- LOGO --- */}
        <div className="flex-1 flex items-center italic font-black text-2xl text-[#B48C00]">
          <Link href={`/${lang}`}>
            <img
              src="/logo.jpg"
              alt="Logo"
              className="h-12 w-12 rounded-full object-cover border border-gray-100 cursor-pointer"
            />
          </Link>
        </div>

        {/* --- NAVIGATION MENU (DESKTOP) --- */}
       <nav className="hidden md:flex flex-[2] justify-center items-center gap-10 text-black font-bold">
  {t.nav.map((item: any, index: number) => (
    <Link
      key={index}
      // ចំណុចសំខាន់៖ ត្រូវមាន /${lang}/ នៅពីមុខជានិច្ច
      href={`/${lang}/${item.path}`} 
      className="hover:text-[#B99808] transition-colors whitespace-nowrap"
    >
      {item.label}
    </Link>
  ))}
</nav>
        
        {/* --- ACTIONS (RIGHT SIDE) --- */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-6">
          
          {/* Language Switcher */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-2 text-gray-500 font-bold hover:text-[#B99808] transition-all"
          >
            <Globe size={18} />
            <span className="text-xs uppercase">{lang === 'kh' ? 'Kh' : 'EN'}</span>
          </button>

          {/* --- CART ICON --- */}
          <Link 
            href={`/${lang}/cart`} 
            className="relative p-2.5 bg-gray-50 rounded-full border border-gray-100 hover:bg-gray-100 transition-all group"
          >
            <ShoppingCart size={22} className="text-[#B48C00] group-hover:scale-110 transition-transform" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white animate-in zoom-in">
                {totalItems}
              </span>
            )}
          </Link>

          {/* --- USER PROFILE / LOGIN --- */}
          {userData ? (
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border hover:bg-gray-100 transition-all shadow-sm"
              >
                <div className="w-8 h-8 bg-[#B48C00] rounded-full flex items-center justify-center text-white">
                  <User size={18} />
                </div>
                <span className="font-bold text-sm">{userData.name}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in duration-200">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 font-bold transition-colors text-sm"
                  >
                    <LogOut size={16} />
                    {lang === 'kh' ? 'ចាកចេញ' : 'Logout'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href={`/${lang}/customer-login`}>
              <button className="bg-[#B48C00] text-white px-7 py-2.5 rounded-full font-bold hover:bg-[#967500] transition-all shadow-md active:scale-95 text-sm uppercase tracking-wide">
                {lang === 'kh' ? 'ចូល' : 'Login'}
              </button>
            </Link>
          )}
        </div>

        {/* --- MOBILE MENU BUTTON --- */}
        <button className="md:hidden text-[#B99808] p-2 hover:bg-gray-50 rounded-lg transition-all" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* --- MOBILE MENU CONTENT --- */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-2xl md:hidden flex flex-col p-8 gap-6 border-t border-gray-50 animate-in fade-in slide-in-from-top-5 duration-300">
          {t.nav.map((item: any, index: number) => (
            <Link key={index} href={`/${lang}/${item.path}`} onClick={() => setIsMenuOpen(false)} className="text-black font-bold text-xl border-b border-gray-50 pb-4 active:text-[#B48C00]">
              {item.label}
            </Link>
          ))}

          {/* Cart Section (Mobile) */}
          <Link href={`/${lang}/cart`} onClick={() => setIsMenuOpen(false)} className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-gray-100 font-bold">
            <div className="flex items-center gap-3">
              <ShoppingCart size={24} className="text-[#B48C00]" />
              <span>{lang === 'kh' ? 'Shopping Cart' : 'Your Cart'}</span>
            </div>
            <span className="bg-[#B48C00] text-white px-4 py-1 rounded-full text-sm">{totalItems} Items</span>
          </Link>

          {/* User Section (Mobile) */}
          <div className="flex flex-col gap-4 mt-2">
            {userData ? (
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 font-bold rounded-2xl border border-red-100">
                <LogOut size={20} /> {lang === 'kh' ? 'Logout' : 'Logout'}
              </button>
            ) : (
              <Link href={`/${lang}/customer-login`} onClick={() => setIsMenuOpen(false)}>
                <button className="w-full py-4 bg-[#B48C00] text-white font-bold rounded-2xl shadow-md uppercase">
                  {lang === 'kh' ? 'ចូល' : 'Login Now'}
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}