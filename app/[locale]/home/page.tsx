"use client";

import { useState, useEffect } from 'react';
import { Utensils, Calendar, MapPin, Phone, Send } from 'lucide-react';
import Link from 'next/link';
import Header from '../../components/header'; // Ensure this path is correct
import { messages, Language } from '../../i18n/messages';
import FoodGallery from '@/app/components/card';
import Footer from '@/app/components/footer';

export default function HomePage() {
  const [lang, setLang] = useState<Language>('kh'); // Default to Khmer, change to 'en' for English
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // --- បន្ថែម State សម្រាប់រក្សាទុកទិន្នន័យ User ---
  const [user, setUser] = useState<{ name: string } | null>(null);

  // --- ប្រើ useEffect ដើម្បីទាញទិន្នន័យពី LocalStorage ពេលបើក Page ---
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing user data", error);
      }
    }
  }, []);

  const t = messages[lang];

  // Prepare catering images with dynamic language links
  const catering = [
    {
      src: "/bd.jpg",
      label: t.factory,
      href: `/${lang}/services/factory`,
      className: "font-bold"
    },
    {
      src: "/Festive.webp",
      label: t.food,
      href: `/${lang}/services/food`,
      className: "font-bold"
    },
    {
      src: "/wedding.jpg",
      label: t.both,
      href: `/${lang}/services/both`,
      className: "font-bold"
    },
  ];

  const toggleLang = () => setLang(lang === 'en' ? 'kh' : 'en');

  return (
    <div className={`min-h-screen bg-white text-white ${lang === 'kh' ? 'font-khmer' : 'font-sans'}`}>
        <Header lang={lang} toggleLang={toggleLang} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      {/* --- Hero Section --- */}
      <header className="relative min-h-[500px] flex items-center pt-20 pb-10 px-6">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2000"
            className="w-full h-full object-cover dark:brightness-40"
            alt="Hero background"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h2 className="text-white text-4xl md:text-6xl font-bold tracking-widest">{t.heroTitle}</h2>
            <h1 className="text-2xl md:text-5xl lg:text-3xl font-extrabold leading-tight">
              {t.heroSub}
            </h1>
            <a 
              href={`/${lang}/booking`}
              className="border-2 border-[#B99808] text-white px-10 py-3 font-bold hover:bg-[#B99808] bg-[#2d1212]/50 hover:text-white transition-all uppercase text-sm"
            >
              {t.btnMore}
            </a>
          </div>

          {/* <div className="hidden md:flex justify-end gap-4 relative h-[400px]">
            <div className="w-48 h-64 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl mt-10">
              <img src="/image1.jpg" className="h-full w-full object-cover" alt="Featured 1" />
            </div>
            <div className="w-48 h-64 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl self-end mb-10">
              <img src="/image2.jpg" className="h-full w-full object-cover" alt="Featured 2" />
            </div>
          </div> */}
        </div>
      </header>

      {/* --- Features Heading --- */}
      <section className="py-20  flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
          {t.heading}
        </h1>
        <p className="text-gray-400 max-w-2xl text-2xl leading-relaxed">
          {t.peading}
        </p>
      </section>

      {/* --- Features Section --- */}
      <section className="py-20 ">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 text-center">
          <div className="flex flex-col items-center gap-4">
            <Utensils className="w-16 h-16 text-[#333333]" />
            <h3 className="text-2xl font-bold text-[#333333]">{t.professionalchef}</h3>
            <p className="text-gray-400 max-w-sm">{t.experince}</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Calendar className="w-16 h-16 text-[#333333]" />
            <h3 className="text-2xl font-bold text-[#333333]">{t.prepareallprograms}</h3>
            <p className="text-gray-400 max-w-sm">{t.event}</p>
          </div>
        </div>
      </section>

      {/* --- Stats Banner --- */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070"
            alt="Stats Background"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-[#3d1a1a]/40 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h4 className="text-xl md:text-2xl font-bold text-gray-300 mb-2">{t.stats.food}</h4>
            <p className="text-4xl md:text-5xl font-black text-black">100+</p>
          </div>
          <div>
            <h4 className="text-xl md:text-2xl font-bold text-gray-300 mb-2">{t.stats.branch}</h4>
            <p className="text-4xl md:text-5xl font-black text-black">15</p>
          </div>
          <div>
            <h4 className="text-xl md:text-2xl font-bold text-gray-300 mb-2">{t.stats.staff}</h4>
            <p className="text-4xl md:text-5xl font-black text-black">50+</p>
          </div>
          <div>
            <h4 className="text-xl md:text-2xl font-bold text-gray-300 mb-2">{t.stats.happy}</h4>
            <p className="text-4xl md:text-5xl font-black text-black">98%</p>
          </div>
        </div>
      </section>

      {/* --- Catering Service --- */}
      <section className="py-20  flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
          {t.cateringservice}
        </h1>
        <FoodGallery images={catering} />
      </section>
     <Footer t={t} lang={lang} />
    </div>
  );
}