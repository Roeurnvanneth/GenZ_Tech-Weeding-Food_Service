"use client";

import { useState } from 'react';
import { Utensils, Calendar, MapPin, Phone, Send } from 'lucide-react';
import Link from 'next/link';
import Header from '../../components/header'; // Make sure path is correct
import { messages, Language } from '../../i18n/messages';
import FoodGallery from '@/app/components/card';

export default function HomePage() {
  const [lang, setLang] = useState<Language>('kh');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = messages[lang];

  //2.Perpare image
const catering = [
    {
      src: "/bd.jpg",
      label: t.birthday,
      href: "/services/birthday"
    },
    {
        src: "/Festive.webp",
        label: t.ceremony,
        href: "/services/festive"
    },
    {
      src: "/wedding.jpg",
      label: t.wedding,
      href: "/services/wedding"
},
  
]

  const toggleLang = () => setLang(lang === 'en' ? 'kh' : 'en');

  return (
    <div className={`min-h-screen bg-[#3d1a1a] text-white ${lang === 'kh' ? 'font-khmer' : 'font-sans'}`}>
      
      {/* 1. CALL THE SHARED HEADER */}
      <Header
        lang={lang}
        toggleLang={toggleLang}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

     {/* --- Hero Section --- */}

    <header className="relative min-h-[500px] flex items-center pt-20 pb-10 px-6">
        <div className="absolute inset-0 z-0">
            <img
                src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2000"
                className="w-full h-full object-cover opacity-40"
                alt="Hero background"
            />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
                <h2 className="text-[#B99808] text-4xl md:text-6xl font-bold tracking-widest">{t.heroTitle}</h2>
                <h1 className="text-2xl md:text-5xl lg:text-3xl font-extrabold leading-tight">
                    {t.heroSub}
                </h1>
            <button className="border-2 border-[#B99808] text-[#B99808] px-10 py-3 font-bold hover:bg-[#B99808] hover:text-white transition-all uppercase text-sm">
                {t.btnMore}
            </button>
        </div>
    {/* Featured Image Cards (Matching your design) */}
        <div className="hidden md:flex justify-end gap-4 relative h-[400px]">
            <div className="w-48 h-64 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl mt-10">
                <img src="/image1.jpg" className="h-full w-full object-cover" />
        </div>
        <div className="w-48 h-64 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl self-end mb-10">
            <img src="/image2.jpg" className="h-full w-full object-cover" />
        </div>
        </div>
        </div>
</header>
           {/* Features heading */}
<section className="py-20 bg-[#2d1212] flex flex-col items-center justify-center text-center px-6">
    {/* Title */}
    <h1 className="text-3xl md:text-3xl text-4xl font-bold text-[#B99808] mb-4">
      {t.heading}
    </h1>
    
    {/* Subtitle/Paragraph */}
    <p className="text-gray-400 max-w-2xl text-2xl leading-relaxed">
      {t.peading}
    </p>
    
    {/* Optional: Small Gold Divider line under the heading */}
</section>
          {/* --- Features Section --- */}
      <section className="py-20 bg-[#2d1212]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 text-center">
          <div className="flex flex-col items-center gap-4">
            <Utensils className="w-16 h-16 text-[#B99808]" />
            <h3 className="text-2xl font-bold text-[#B99808]">{t.professionalchef}</h3>
            <p className="text-gray-400 max-w-sm">{t.experince}</p>
            </div>
            <div className="flex flex-col items-center gap-4">
            <Calendar className="w-16 h-16 text-[#B99808]" />
            <h3 className="text-2xl font-bold text-[#B99808]">{t.prepareallprograms}</h3>
            <p className="text-gray-400 max-w-sm">{t.event}</p>
            </div>
            </div>
            </section>
            {/* --- Stats Banner --- */}
            <section className="relative py-20 overflow-hidden">
            {/* 1. The Background Image */}
            <div className="absolute inset-0 z-0">
            <img
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070"
            alt="Stats Background"
            className="w-full h-full object-cover opacity-70"
            />
            {/* 2. Dark Overlay - Crucial for text readability */}
            <div className="absolute inset-0 bg-[#3d1a1a]/10 backdrop-blur-sm"></div>
            </div>
            {/* 3. The Content (Must have relative and z-10) */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
            <h4 className="text-xl md:text-2xl font-bold text-gray-300 mb-2">{t.stats.food}</h4>
            <p className="text-4xl md:text-5xl font-black text-[#B99808]">100+</p>
            </div>
            <div>
            <h4 className="text-xl md:text-2xl font-bold text-gray-300 mb-2">{t.stats.branch}</h4>
            <p className="text-4xl md:text-5xl font-black text-[#B99808]">15</p>
            </div>
            <div>
            <h4 className="text-xl md:text-2xl font-bold text-gray-300 mb-2">{t.stats.staff}</h4>
            <p className="text-4xl md:text-5xl font-black text-[#B99808]">50+</p>
            </div>
            <div>
            <h4 className="text-xl md:text-2xl font-bold text-gray-300 mb-2">{t.stats.happy}</h4>
            <p className="text-4xl md:text-5xl font-black text-[#B99808]">98%</p>
            </div>
            </div>
        </section>

      {/*Catering service */}
      <section className="py-20 bg-[#2d1212] flex flex-col items-center justify-center text-center px-6">
    {/* Title */}
    <h1 className="text-3xl md:text-3xl text-4xl font-bold text-[#B99808] mb-4">
      {t.cateringservice}
    </h1>
     {/*Insert component image */}
        <FoodGallery images={catering} />
</section>
      {/* --- Footer --- */}
      <footer className="py-20 px-6 bg-[#2d1212]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#B99808]">{t.heroTitle}</h3>
            <p className="text-gray-400 hover:text-white">{t.attractive}</p>
            <div className="flex gap-4">
              <a href="tel:0967932352" className="bg-[#B99808] p-3 rounded-full hover:scale-110 transition-transform"><Phone size={20} /></a>
              <a href="#" className="bg-[#B99808] p-3 rounded-full hover:scale-110 transition-transform"><Send size={20} className="rotate-[-20deg]" /></a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-[#B99808] uppercase tracking-widest">{lang === 'en' ? 'Links' : 'តំណភ្ជាប់'}</h4>
            <div className="flex flex-col gap-2">
              {t?.nav?.map((item) => <a key={item} href="#" className="text-gray-400 hover:text-white">{item}</a>)}
            </div>
          </div>

          <div className="space-y-4 text-sm text-gray-400">
            <h4 className="text-lg font-bold text-[#B99808] uppercase tracking-widest">{lang === 'en' ? 'Contact' : 'ទំនាក់ទំនង'}</h4>
            <p className="flex items-center gap-3"><MapPin size={18} className="text-[#B99808]" /> {t.location}</p>
            <p className="flex items-center gap-3"><Phone size={18} className="text-[#B99808]" /> 096 793 2352</p>
          </div>
        </div>
      </footer>
    </div>
  );
}