"use client";

import { useState } from 'react';
import { Utensils, Calendar, MapPin, Phone, Send } from 'lucide-react';
import Header from '../../components/header'
import { messages, Language } from '../../i18n/messages';

export default function AboutPage() {
    //hooks must be inside the function
    const [lang, setLang] = useState<Language>('kh');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const t = messages[lang];

    const toggleLang = () => setLang(lang === 'en' ? 'kh' : 'en');

    return (
        <div className={`min-h-screen bg-[#3d1a1a] text-white ${lang === 'kh' ? 'font-khmer' : 'font-sans'}`}>
            {/*header*/}
                <Header
                    lang={lang}
                    toggleLang={toggleLang}
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
            />
            {/*Hero Banner*/}
            <section className="relative h-[400px] flex items-center justify-center pt-20">
                <div className="absolute inset-0 z-0">
                    <img src="/service.webp" className="w-full h-full object-cover " alt="About hero" />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 py-20 space-y-32">
                {/* This PARENT div creates the row */}
<section className="grid md:grid-cols-2 gap-10 items-start w-full max-w-7xl mx-auto px-6 py-10">
    
    {/* BOX 1: Left Side (Heading & Story) */}
    <div className="space-y-6">
        <h2 className="text-[#B99808] text-3xl font-bold">
            {t.AboutUs || "អំពីយើង"}
        </h2>
        <p className="text-[#B99808] text-lg leading-relaxed whitespace-pre-line font-medium">
            {t.storyTitle || "Your story text goes here..."}
        </p>
    </div>

    {/* BOX 2: Right Side (Detailed Paragraphs) */}
    <div className="space-y-6">
        <p className="text-gray-300 text-base leading-relaxed">
            {t.p1}
        </p>
        <p className="text-gray-300 text-base leading-relaxed">
            {t.p2}
        </p>
        <p className="text-gray-300 text-base leading-relaxed">
            {t.p3}
        </p>
    </div>
</section>
<div className="rounded-2xl overflow-hidden border-2 border-[#B99808]/20 shadow-2xl">
        <img src="/chef.jpg" className="w-full object-cover" alt="Our Staff" />
    </div>
    </main>
        {/*Mission section */}
        <div className=" max-w-7xl mx-auto px-6 py-10">
        <section className="grid md:grid-cols-2 gap-16 justify-items-center">
            {/*left side image */}
            <div className="order-2 md:order-1 rounded-2xl overflow-hidden border-2 border-[#B99808]/20 shadow-2xl flex justify-center">
                <img
                src="/neagteav.jpg"
                className="w-[500px] h-[500px] object-cover"
                alt="Our Service"
                />
            </div>
            {/*Right side text */}
            <div className="order-1 md:order-2 space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
                <h3 className="text-[#B99808] text-xl font-bold upperacse tracking-widest">
                    {t.missionLabel || "ចក្ខុវិស័យរបស់យើង"}
                </h3>
                <h2 className="text-3xl text-[#B99808] font-bold leading-tight">
                    {t.missionTitle || "បម្រើសេវាកម្មអាហារដ៏ពិសេសសំរាប់អ្នក"}
                </h2>
                <p className="text-gray-400  max-w-md">
                    {t.missionDesc}
                </p>
            </div>
        </section>
        </div>
        
    </div>
    )
}