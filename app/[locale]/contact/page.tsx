"use client";

import React, { useState, use } from 'react';
import { messages, Language } from '../../i18n/messages';
import Link from 'next/link';

export default function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
    // 1. Extract the locale from the URL params using 'use'
    const { locale } = use(params);
    
    // 2. Cast the locale to your Language type ('en' or 'kh')
    const lang = (locale === 'en' || locale === 'kh' ? locale : 'en') as Language;
    
    // 3. Get the correct translations
    const t = messages[lang];

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        message: "",
    });

    const [error, setError] = useState({
        name: "",
        phone: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let newError = { name: "", phone: "" };
        let hasError = false;

        if (!formData.name.trim()) {
            newError.name = lang === 'kh' ? "សូមបញ្ចូលឈ្មោះរបស់អ្នក" : "Please enter your name";
            hasError = true;
        }
        if (!formData.phone.trim()) {
            newError.phone = lang === 'kh' ? "សូមបញ្ចូលលេខទូរស័ព្ទរបស់អ្នក" : "Please enter your phone number";
            hasError = true;
        }

        setError(newError);
        if (hasError) return;

        alert(lang === 'kh' ? "សំណើរបស់អ្នកត្រូវបានផ្ញើ!" : "Your request has been sent!");
    };

    return (
        <div className={`min-h-screen bg-white text-black ${lang === 'kh' ? 'font-khmer' : 'font-sans'}`}>
            {/* HERO SECTION */}
            <header className="relative min-h-[500px] flex items-center justify-center pt-20 pb-10 px-6">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2000"
                        className="w-full h-full object-cover brightness-50" 
                        alt="Hero background"
                    />
                </div>
                <div className="relative z-10 w-full flex justify-center items-center">
                    <div className="border-2 border-[#B99808] w-[250px] text-white px-10 py-3 font-bold bg-[#2d1212]/50 text-center uppercase text-xl">
                        {t.contactUs}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-24">
                <div className="flex flex-col lg:flex-row gap-12 items-start justify-between">
                    <div className="lg:w-1/2 space-y-6">
                        <h1 className="text-6xl font-black text-black tracking-tight">
                            {lang === 'kh' ? 'ទាក់ទងយើង' : 'Contact Us'}
                        </h1>
                        <p className="text-black text-lg max-w-md leading-relaxed">
                            {lang === 'kh' 
                                ? 'សូមបំពេញព័ត៌មានរបស់អ្នក ឬស្កែន QR Code ដើម្បីទាក់ទង Telegram របស់យើង។' 
                                : 'Please fill in your info or scan the QR Code to contact our Telegram.'}
                        </p>
                        <div className="flex items-start gap-3 pt-4">
                            <span className="text-2xl">📍</span>
                            <p className="text-black font-medium">{t.location}</p>
                        </div>
                    </div>

                    {/* FORM SECTION */}
                    <div className="lg:w-[550px] w-full bg-[#1A0B0B] rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                        <h2 className="text-[#C59D5F] text-center text-xl font-bold uppercase tracking-widest mb-10">
                            {t.contactUs}
                        </h2>

                        <div className="flex flex-col md:flex-row gap-10">
                            <form className="flex-1 space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <label className="text-white text-xs font-bold uppercase ml-1">{t.labelName}</label>
                                    <input 
                                        type="text"
                                        placeholder={lang === 'kh' ? 'ឈ្មោះ' : 'Name'}
                                        className={`w-full bg-[#916F00] placeholder-gray-300 text-white border-none rounded-xl p-4 outline-none focus:ring-2 ${error.name ? 'ring-2 ring-red-500' : 'focus:ring-[#C59D5F]'}`}
                                        onChange={(e) => {
                                            setFormData({...formData, name: e.target.value});
                                            if (error.name) setError({...error, name: ""});
                                        }}
                                    />
                                    {error.name && <p className="text-red-500 text-xs mt-1 italic">{error.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-white text-xs font-bold uppercase ml-1">{t.labelPhone}</label>
                                    <input 
                                        type="tel"
                                        placeholder={lang === 'kh' ? 'លេខទូរស័ព្ទ' : 'Phone'}
                                        className={`w-full bg-[#916F00] placeholder-gray-300 text-white border-none rounded-xl p-4 outline-none focus:ring-2 ${error.phone ? 'ring-2 ring-red-500' : 'focus:ring-[#C59D5F]'}`}
                                        onChange={(e) => {
                                            setFormData({...formData, phone: e.target.value});
                                            if (error.phone) setError({...error, phone: ""});
                                        }}
                                    />
                                    {error.phone && <p className="text-red-500 text-xs mt-1 italic">{error.phone}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-white text-xs font-bold uppercase ml-1">{lang === 'kh' ? 'សារ' : 'Message'}</label>
                                    <textarea
                                        placeholder={lang === 'kh' ? 'សាររបស់អ្នក...' : 'Your message...'}
                                        className="w-full bg-[#916F00] placeholder-gray-300 text-white border-none rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#C59D5F]"
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    />
                                </div>

                                <button type="submit" className="w-full border border-[#C59D5F] text-[#C59D5F] py-3 rounded-full font-bold uppercase tracking-widest hover:bg-[#C59D5F] hover:text-white transition-all mt-4">
                                    {t.labelSubmit}
                                </button>
                            </form>

                            <div className="flex flex-col items-center justify-center space-y-4">
                                <p className="text-[#C59D5F] text-[10px] font-black uppercase tracking-tighter">Scan to Telegram</p>
                                <div className="bg-white p-4 rounded-3xl shadow-lg">
                                    <img src="/tlg.jpg" alt="Telegram QR" className="w-32 h-32 object-contain" />
                                </div>
                                <Link href="https://t.me/LYZA2701" className="text-white font-bold text-sm mt-2 hover:text-[#C59D5F]" target="_blank">@LYZA2701</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}