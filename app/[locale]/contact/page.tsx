"use client";

import React, { useState, use } from 'react';
import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
import { messages, Language } from '../../i18n/messages';
import Link from 'next/link';

export default function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
    const resolvedParams = use(params);
    const initialLang = (resolvedParams.locale === 'kh' ? 'kh' : 'en') as Language;
    
    const [lang, setLang] = useState<Language>(initialLang);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        message: "",
    });

    const toggleLang = () => setLang(lang === 'en' ? 'kh' : 'en');
    const t = messages[lang];

    return (
        <div className={`min-h-screen bg-white text-[#3s33333] ${lang === 'kh' ? 'font-khmer' : 'font-sans'}`}>
            {/* 1. HEADER WITH DYNAMIC PROFILE/LOGIN */}
                 <Header
                   lang={lang}
                   toggleLang={toggleLang}
                   isMenuOpen={isMenuOpen}
                   setIsMenuOpen={setIsMenuOpen}
                   user={null} // បោះ user ទៅឱ្យ Header ដើម្បីបង្ហាញ Profile
                 />
           
                 {/* --- Hero Section --- */}
                 <header className="relative min-h-[500px] flex items-center justify-center pt-20 pb-10 px-6">
  {/* Background Image */}
  <div className="absolute inset-0 z-0">
    <img
      src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2000"
      className="w-full h-full object-cover brightness-50" 
      alt="Hero background"
    />
  </div>

  {/* Button Container */}
  <div className="relative z-10 w-full flex justify-center items-center">
    <button className="border-2 border-[#B99808] w-[250px] text-white px-10 py-3 font-bold hover:bg-[#B99808] bg-[#2d1212]/50 hover:text-white transition-all uppercase text-xl">
      {t.contactUs}
    </button>
  </div>
</header>

            <main className="max-w-7xl mx-auto px-6 py-24">
                <div className="flex flex-col lg:flex-row gap-12 items-start justify-between">
                    
                    {/* LEFT SIDE: Text & Address */}
                    <div className="lg:w-1/2 space-y-6">
                        <h1 className="text-6xl font-black text-black tracking-tight">
                            {lang === 'kh' ? 'ទាក់ទងយើង' : 'Contact Us'}
                        </h1>
                        <p className="text-gray-500 text-lg max-w-md leading-relaxed">
                            {lang === 'kh' 
                                ? 'សូមបំពេញព័ត៌មានរបស់អ្នក ឬស្កែន QR Code ដើម្បីទាក់ទង Telegram របស់យើង។' 
                                : 'Please fill in your info or scan the QR Code to contact our Telegram.'}
                        </p>
                        
                        <div className="flex items-start gap-3 pt-4">
                            <span className="text-2xl">📍</span>
                            <p className="text-gray-600 font-medium">
                                {t.location}
                            </p>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Dark Quick Contact Card */}
                    <div className="lg:w-[550px] w-full bg-[#1A0B0B] rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                        <h2 className="text-[#C59D5F] text-center text-xl font-bold uppercase tracking-widest mb-10">
                            {t.contactUs}
                        </h2>

                        <div className="flex flex-col md:flex-row gap-10">
                            {/* Form */}
                            <form className="flex-1 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-white text-xs font-bold uppercase ml-1">{t.labelName}</label>
                                    <input 
                                        type="text"
                                        placeholder="Enter Your Name"
                                        className="w-full bg-[#916F00] placeholder-gray-300 text-white border-none rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#C59D5F]"
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-white text-xs font-bold uppercase ml-1">{t.labelPhone}</label>
                                    <input 
                                        type="tel"
                                        placeholder="Phone"
                                        className="w-full bg-[#916F00] placeholder-gray-300 text-white border-none rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#C59D5F]"
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-white text-xs font-bold uppercase ml-1">{lang === 'kh' ? 'សារ' : 'Message'}</label>
                                    <textarea 
                                        placeholder="message..."
                                        className="w-full bg-[#916F00] placeholder-gray-300 text-white border-none rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#C59D5F]"
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    />
                                </div>

                                <button className="w-full border border-[#C59D5F] text-[#C59D5F] py-3 rounded-full font-bold uppercase tracking-widest hover:bg-[#C59D5F] hover:text-white transition-all mt-4">
                                    {t.labelSubmit}
                                </button>
                            </form>

                            {/* Telegram QR Section */}
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <p className="text-[#C59D5F] text-[10px] font-black uppercase tracking-tighter">
                                    Scan to Telegram
                                </p>
                                <div className="bg-white p-4 rounded-3xl shadow-lg">
                                    {/* Replace with your actual QR image path */}
                                    <img 
                                        src="/tlg.jpg" 
                                        alt="Telegram QR" 
                                        className="w-32 h-32 object-contain"
                                    />
                                </div>
                                <Link href="https://t.me/LYZA2701" className="text-white font-bold text-sm mt-2" target="_blank" rel="noopener noreferrer">
                                    @LYZA2701
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer t={t} lang={lang} />
        </div>
    );
}