"use client";

import React from 'react';
import { Menu, X, Globe, LogOut, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { messages, Language } from '../i18n/messages';

interface HeaderProps {
  lang: Language;
  toggleLang: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  user: { name: string } | null; // ទទួលទិន្នន័យ User ពី HomePage
}

export default function Header({ lang, toggleLang, isMenuOpen, setIsMenuOpen, user }: HeaderProps) {
  const t = messages[lang];

  // អនុគមន៍សម្រាប់ Logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.reload(); 
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md h-20 flex items-center border-b border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center text-black">
        
        {/* --- LOGO --- */}
        <div className="flex-1 flex items-center">
          <Link href={`/${lang}`}>
            <img
              src="/logo.jpg"
              alt="Logo"
              className="h-12 w-12 rounded-full object-cover border border-gray-100 shadow-sm" 
            />
          </Link>
        </div>

        {/* --- MENU (Center) --- */}
        <nav className="hidden md:flex flex-[2] justify-center items-center gap-10 text-[#B99808] font-bold">
          {t?.nav?.map((item: string, index: number) => (
            <a key={index} href={`#${index}`} className="hover:text-black transition-colors whitespace-nowrap uppercase text-sm tracking-wide">
              {item}
            </a>
          ))}
        </nav>
        
        {/* --- ACTIONS (Right) --- */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-5">
          {/* Language Button */}
          <button 
            onClick={toggleLang} 
            className="flex items-center gap-2 text-gray-500 font-bold hover:text-[#B99808] transition-colors"
          >
            <Globe size={18} />
            <span className="text-sm uppercase">{lang === 'kh' ? 'KH' : 'EN'}</span>
          </button>

          {/* --- DYNAMIC PROFILE OR LOGIN --- */}
          {user ? (
            <div className="flex items-center gap-3 bg-gray-50 pl-4 pr-1.5 py-1.5 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex flex-col items-end">
                <span className="text-xs font-black text-slate-800 leading-none">
                  {user.name}
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-[9px] text-red-500 font-bold uppercase tracking-tighter hover:underline mt-1"
                >
                  {lang === 'kh' ? 'ចាកចេញ' : 'Logout'}
                </button>
              </div>
              {/* Avatar Circle */}
              <div className="h-10 w-10 bg-gradient-to-tr from-[#B48C00] to-[#E5B80B] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner ring-2 ring-white uppercase">
                {user.name.charAt(0)}
              </div>
            </div>
          ) : (
            <Link
              href={`/${lang}/customer-login`}
              className="bg-[#B48C00] text-white px-8 py-2.5 rounded-full font-bold hover:bg-[#967500] transition-all active:scale-95 shadow-lg shadow-yellow-900/10"
            >
              {lang === 'kh' ? 'ចូលប្រើ' : 'Login'}
            </Link>
          )}
        </div>

        {/* --- MOBILE TOGGLE --- */}
        <button className="md:hidden text-[#B99808] p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* --- MOBILE DROPDOWN --- */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-2xl md:hidden flex flex-col p-8 gap-6 border-t animate-in fade-in slide-in-from-top-5 duration-300">
          
          {/* Mobile Profile Area */}
          {user && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
               <div className="h-14 w-14 bg-[#B48C00] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md uppercase">
                  {user.name.charAt(0)}
               </div>
               <div className="flex flex-col">
                  <span className="font-black text-slate-900 text-lg">{user.name}</span>
                  <button onClick={handleLogout} className="text-sm text-red-500 font-bold text-left">
                     {lang === 'kh' ? 'ចាកចេញពីគណនី' : 'Sign out'}
                  </button>
               </div>
            </div>
          )}

          {t?.nav?.map((item: string, index: number) => (
            <a 
              key={index} 
              href="#" 
              className={`text-[#B99808] font-bold text-xl border-b pb-3 border-gray-50 ${lang === 'kh' ? 'font-khmer' : ''}`} 
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </a>
          ))}
         
          <div className="flex flex-col gap-4 mt-2">
            <button 
              onClick={() => { toggleLang(); setIsMenuOpen(false); }} 
              className="flex items-center justify-center gap-2 text-gray-600 font-bold py-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors"
            >
              <Globe size={20} /> 
              {lang === 'en' ? 'ភាសាខ្មែរ' : 'English'}
            </button>

            {!user && (
              <Link href={`/${lang}/customer-login`} className="w-full">
                <button 
                  onClick={() => setIsMenuOpen(false)} 
                  className="w-full flex items-center justify-center py-4 bg-[#B48C00] text-white font-bold rounded-2xl shadow-md active:scale-[0.98] transition-all"
                >
                  {lang === 'kh' ? 'ចូលប្រើប្រាស់ឥឡូវនេះ' : 'Login Now'}
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}