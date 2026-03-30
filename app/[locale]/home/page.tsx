"use client";

import { useState, useEffect } from 'react';
import { Utensils, Calendar, MapPin, Phone, Send } from 'lucide-react';
import Link from 'next/link';
import Header from '../../components/header'; // ផ្ទៀងផ្ទាត់ Path ឱ្យត្រូវតាម Folder របស់អ្នក
import { messages, Language } from '../../i18n/messages';
import FoodGallery from '@/app/components/card';

export default function HomePage() {
  // --- STATE សម្រាប់គ្រប់គ្រងភាសា និង Menu ---
  const [lang, setLang] = useState<Language>('kh');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // --- STATE សម្រាប់រក្សាទុកទិន្នន័យ Profile User ---
  const [user, setUser] = useState<{ name: string } | null>(null);

  // --- ទាញយកទិន្នន័យ User នៅពេល Page ចាប់ផ្ដើមដំណើរការ (Mount) ---
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const t = messages[lang];

  // រៀបចំរូបភាពសម្រាប់សេវាកម្ម Catering
  const catering = [
    {
      src: "/bd.jpg",
      label: t.birthday,
      href: `/${lang}/services/birthday`
    },
    {
      src: "/Festive.webp",
      label: t.ceremony,
      href: `/${lang}/services/festive`
    },
    {
      src: "/wedding.jpg",
      label: t.wedding,
      href: `/${lang}/services/wedding`
    },
  ];

  const toggleLang = () => setLang(lang === 'en' ? 'kh' : 'en');

  return (
    <div className={`min-h-screen bg-[#3d1a1a] text-white ${lang === 'kh' ? 'font-khmer' : 'font-sans'}`}>
      
      {/* --- HEADER --- */}
      <Header
        lang={lang}
        toggleLang={toggleLang}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        user={user} // បញ្ជូនព័ត៌មាន User ទៅកាន់ Header ដើម្បីបង្ហាញ Profile
      />

      {/* --- Hero Section --- */}
      <header className="relative min-h-[600px] flex items-center pt-20 pb-10 px-6">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2000"
            className="w-full h-full object-cover opacity-40"
            alt="Hero background"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-[#B99808] text-4xl md:text-6xl font-bold tracking-widest">{t.heroTitle}</h2>
            <h1 className="text-2xl md:text-5xl font-extrabold leading-tight">
              {t.heroSub}
            </h1>
            <button className="border-2 border-[#B99808] text-[#B99808] px-10 py-3 font-bold hover:bg-[#B99808] hover:text-white transition-all uppercase">
              {t.btnMore}
            </button>
          </div>

          <div className="hidden md:flex justify-end gap-4 relative h-[400px]">
            <div className="w-48 h-64 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl mt-10">
              <img src="/image1.jpg" className="h-full w-full object-cover" alt="Featured 1" />
            </div>
            <div className="w-48 h-64 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl self-end mb-10">
              <img src="/image2.jpg" className="h-full w-full object-cover" alt="Featured 2" />
            </div>
          </div>
        </div>
      </header>

      {/* --- Features Heading --- */}
      <section className="py-20 bg-[#2d1212] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#B99808] mb-4">
          {t.heading}
        </h1>
        <p className="text-gray-400 max-w-2xl text-xl leading-relaxed">
          {t.peading}
        </p>
      </section>

      {/* --- Features Section --- */}
      <section className="py-20 bg-[#2d1212]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 text-center">
          <div className="flex flex-col items-center gap-4 group">
            <div className="p-5 bg-white/5 rounded-full group-hover:bg-[#B99808]/20 transition-colors">
              <Utensils className="w-16 h-16 text-[#B99808]" />
            </div>
            <h3 className="text-2xl font-bold text-[#B99808]">{t.professionalchef}</h3>
            <p className="text-gray-400 max-w-sm">{t.experince}</p>
          </div>
          <div className="flex flex-col items-center gap-4 group">
            <div className="p-5 bg-white/5 rounded-full group-hover:bg-[#B99808]/20 transition-colors">
              <Calendar className="w-16 h-16 text-[#B99808]" />
            </div>
            <h3 className="text-2xl font-bold text-[#B99808]">{t.prepareallprograms}</h3>
            <p className="text-gray-400 max-w-sm">{t.event}</p>
          </div>
        </div>
      </section>

      {/* --- Catering Service --- */}
      <section className="py-20 bg-[#2d1212] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#B99808] mb-10">
          {t.cateringservice}
        </h1>
        <FoodGallery images={catering} />
      </section>

      {/* --- Footer --- */}
      <footer className="py-20 px-6 bg-[#2d1212] border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#B99808]">{t.heroTitle}</h3>
            <p className="text-gray-400">{t.attractive}</p>
            <div className="flex gap-4">
              <a href="tel:0967932352" className="bg-[#B99808] p-3 rounded-full hover:scale-110 transition-transform"><Phone size={20} /></a>
              <a href="#" className="bg-[#B99808] p-3 rounded-full hover:scale-110 transition-transform"><Send size={20} className="rotate-[-20deg]" /></a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-[#B99808] uppercase tracking-widest">{lang === 'en' ? 'Links' : 'តំណភ្ជាប់'}</h4>
            <div className="flex flex-col gap-2">
              {t?.nav?.map((item: string) => <a key={item} href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>)}
            </div>
          </div>

          <div className="space-y-4 text-sm text-gray-400">
            <h4 className="text-lg font-bold text-[#B99808] uppercase tracking-widest">{lang === 'en' ? 'Contact' : 'ទំនាក់ទំនង'}</h4>
            <p className="flex items-center gap-3"><MapPin size={18} className="text-[#B99808]" /> {t.location}</p>
            <p className="flex items-center gap-3"><Phone size={18} className="text-[#B99808]" /> 096 793 2352</p>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-white/5 text-center text-gray-500 text-xs">
           © 2026 {t.heroTitle}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}