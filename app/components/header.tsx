"use client";

import React from 'react';
import { Menu, X, Globe } from 'lucide-react';
import Link from 'next/link';
import { messages, Language } from '../i18n/messages';

interface HeaderProps {
  lang: Language;
  toggleLang: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export default function Header({ lang, toggleLang, isMenuOpen, setIsMenuOpen }: HeaderProps) {
  const t = messages[lang];

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md h-20 flex items-center border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
        
        {/* --- LOGO --- */}
        <div className="flex-1 flex items-center">
          <Link href="/">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="h-12 w-12 rounded-full object-cover border border-gray-100" 
            />
          </Link>
        </div>

        {/* --- MENU (Center) --- */}
        <nav className="hidden md:flex flex-[2] justify-center items-center gap-10 text-[#B99808] font-bold">
          {t?.nav?.map((item: string, index: number) => (
            <a key={index} href={`#${index}`} className="hover:text-black transition-colors whitespace-nowrap">
              {item}
            </a>
          ))}
        </nav>
        
        {/* --- ACTIONS (Right) --- */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-5">
          <button onClick={toggleLang} className="flex items-center gap-2 text-gray-500 font-bold hover:text-[#B99808]">
            <Globe size={18} />
            <span className="text-sm uppercase">{lang}</span>
          </button>

          <Link
  href="login"
  onClick={() => console.log("Navigating to login...")}
  className="bg-[#B48C00] text-white px-6 py-2 rounded-full font-bold hover:bg-[#967500]
"
>
  {t.button}
</Link>
        </div>
        {/* --- MOBILE TOGGLE --- */}
        <button className="md:hidden text-[#B99808]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* --- MOBILE DROPDOWN --- */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-2xl md:hidden flex flex-col p-8 gap-6 border-t">
          {t?.nav?.map((item: string, index: number) => (
            <a key={index} href="#" className="text-[#B99808] font-bold text-xl border-b pb-3" onClick={() => setIsMenuOpen(false)}>
              {item}
            </a>
          ))}
         
          <div className="flex flex-col gap-4">
            <button onClick={toggleLang} className="flex items-center justify-center gap-2 text-gray-600 font-bold py-3 bg-gray-50 hover:text-[#B99808] rounded-xl">
              <Globe size={20} /> {lang === 'en' ? 'ភាសាខ្មែរ' : 'English'}
            </button>
          </div>
           <div className="flex flex-col gap-4">
            <Link href="login" className="w-full">
          <button onClick={() => setIsMenuOpen(false)} className="w-30 h-10 flex items-center justify-center gap-2 text-black font-bold py-3 border border-[#B99808] hover:bg-[#B99808] hover:text-white rounded-xl">
              {t.button}
            </button>
            </Link>
          </div>
        </div>
        
      )}
    </header>
  );
}