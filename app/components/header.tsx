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
    <header className="bg-white sticky top-0 z-50 shadow-md h-20 flex items-center border-b border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
        
        {/* --- LOGO --- */}
        <div className="flex-1 flex items-center">
          <Link href={`/${lang}`}>
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
          {/* Language Toggle Button */}
          <button 
            onClick={toggleLang} 
            className="flex items-center gap-2 text-gray-500 font-bold hover:text-[#B99808] transition-colors"
          >
            <Globe size={18} />
            <span className="text-sm uppercase">{lang === 'kh' ? 'ខ្មែរ' : 'EN'}</span>
          </button>

          {/* DYNAMIC LOGIN BUTTON */}
          <Link
            href={`/${lang}/customer-login`}
            className="bg-[#B48C00] text-white px-8 py-2.5 rounded-full font-bold hover:bg-[#967500] transition-all active:scale-95 shadow-lg shadow-yellow-900/10"
          >
            {lang === 'kh' ? 'ចូលប្រើ' : 'Login'}
          </Link>
        </div>

        {/* --- MOBILE TOGGLE --- */}
        <button className="md:hidden text-[#B99808] p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* --- MOBILE DROPDOWN --- */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-2xl md:hidden flex flex-col p-8 gap-6 border-t animate-in fade-in slide-in-from-top-5 duration-300">
          {t?.nav?.map((item: string, index: number) => (
            <a 
              key={index} 
              href="#" 
              className={`text-[#B99808] font-bold text-xl border-b pb-3 ${lang === 'kh' ? 'font-khmer' : ''}`} 
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </a>
          ))}
         
          <div className="flex flex-col gap-4 mt-2">
            {/* Mobile Language Switch */}
            <button 
              onClick={() => { toggleLang(); setIsMenuOpen(false); }} 
              className="flex items-center justify-center gap-2 text-gray-600 font-bold py-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors"
            >
              <Globe size={20} /> 
              {lang === 'en' ? 'ភាសាខ្មែរ' : 'English'}
            </button>

            {/* Mobile Login Button */}
            <Link href={`/${lang}/customer-login`} className="w-full">
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="w-full flex items-center justify-center py-4 bg-[#B48C00] text-white font-bold rounded-2xl shadow-md active:scale-[0.98] transition-all"
              >
                {lang === 'kh' ? 'ចូលប្រើប្រាស់ឥឡូវនេះ' : 'Login Now'}
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}