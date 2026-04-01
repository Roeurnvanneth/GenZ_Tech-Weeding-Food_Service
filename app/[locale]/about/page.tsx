"use client";

import { useState } from 'react';
import { MapPin, Phone, Send } from 'lucide-react';
import Header from '../../components/header';
import { messages, Language } from '../../i18n/messages';
import { TeamHeader } from '../../components/teamheader';

export default function AboutPage() {
    const [lang, setLang] = useState<Language>('en');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const t = messages[lang];

    // រក្សាទុក State នៃ Tab នៅទីនេះ ដើម្បីឱ្យ Page ទាំងមូលដឹងថា Tab ណាខ្លះកំពុង Active
    const [activeTab, setActiveTab] = useState<'managers' | 'ourTeam'>('managers');

    const toggleLang = () => setLang(lang === 'en' ? 'kh' : 'en');

    return (
        <div className={`min-h-screen bg-white text-[#333333] ${lang === 'kh' ? 'font-khmer' : 'font-sans'}`}>
            <Header
                lang={lang}
                toggleLang={toggleLang}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen} 
                user={null} 
            />

            {/* Hero Banner */}
            <section className="relative h-[400px] flex items-center justify-center pt-20">
                <div className="absolute inset-0 z-0">
                    <img src="/service.webp" className="w-full h-full object-cover" alt="About hero" />
                    <div className="absolute inset-0 bg-black/30"></div> {/* បន្ថែម Overlay បន្តិចឱ្យអក្សរ Header លេច */}
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 py-20 space-y-32">
                {/* Story Section */}
                <section className="grid md:grid-cols-2 gap-10 items-start">
                    <div className="space-y-6">
                        <h2 className="text-[#B99808] text-3xl font-bold">{t.AboutUs}</h2>
                        <p className="text-lg leading-relaxed whitespace-pre-line font-medium">{t.storyTitle}</p>
                    </div>
                    <div className="space-y-6">
                        <p className="text-base leading-relaxed">{t.p1}</p>
                        <p className="text-base leading-relaxed">{t.p2}</p>
                        <p className="text-base leading-relaxed">{t.p3}</p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="rounded-2xl overflow-hidden border-2 border-[#B99808]/20 shadow-2xl">
                        <img src="/neagteav.jpg" className="w-full h-[500px] object-cover" alt="Our Mission" />
                    </div>
                    <div className="space-y-6 text-center md:text-left">
                        <h3 className="text-[#B99808] text-xl font-bold uppercase tracking-widest">{t.missionLabel}</h3>
                        <h2 className="text-3xl font-bold leading-tight">{t.missionTitle}</h2>
                        <p className="text-gray-500 max-w-md mx-auto md:mx-0">{t.missionDesc}</p>
                    </div>
                </section>

                {/* Team Section (ចំណុចដែលអ្នកចង់ដាក់ Button) */}
                <section className="py-20 flex flex-col items-center justify-center text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#B99808] mb-4">
                        {t.teamwork}
                    </h1>
                    <p className="text-gray-500 max-w-2xl text-xl leading-relaxed mb-10">
                        {t.OurChef}
                    </p>

                    {/* បញ្ចូល TeamHeader និងបញ្ជូន Props ទៅឱ្យវា */}
                    <TeamHeader t={t} active={activeTab} setActive={setActiveTab} />

                    {/* បង្ហាញ Content ផ្សេងគ្នាតាម Tab */}
            <div className="mt-12 w-full transition-opacity duration-500">
    {activeTab === 'managers' ? (
        /* ប្តូរទៅជា grid-cols-4 ដើម្បីឱ្យចេញ ៤ រូបក្នុង ១ ជួរ */
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-2 border border-gray-100 rounded-xl shadow-sm">
                <img src="/image1.jpg" className="w-full h-64 object-cover rounded-lg mb-2" alt="Manager 1" />
                <p className="font-bold text-[#333333]">Manager Name</p>
            </div>
            <div className="p-2 border border-gray-100 rounded-xl shadow-sm">
                <img src="/image2.jpg" className="w-full h-64 object-cover rounded-lg mb-2" alt="Manager 2" />
                <p className="font-bold text-[#333333]">Manager Name</p>
            </div>
            <div className="p-2 border border-gray-100 rounded-xl shadow-sm">
                <img src="/image1.jpg" className="w-full h-64 object-cover rounded-lg mb-2" alt="Manager 3" />
                <p className="font-bold text-[#333333]">Manager Name</p>
            </div>
            <div className="p-2 border border-gray-100 rounded-xl shadow-sm">
                <img src="/image2.jpg" className="w-full h-64 object-cover rounded-lg mb-2" alt="Manager 4" />
                <p className="font-bold text-[#333333]">Manager Name</p>
            </div>
        </div>
    ) : (
        /* ផ្នែក Team Member ក៏ប្រើ grid-cols-4 ដូចគ្នា */
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-2 border border-gray-100 rounded-xl shadow-sm">
                <img src="/image1.jpg" className="w-full h-64 object-cover rounded-lg mb-2" alt="Team 1" />
                <p className="font-bold text-[#333333]">Chef Name</p>
            </div>
            <div className="p-2 border border-gray-100 rounded-xl shadow-sm">
                <img src="/wedding.jpg" className="w-full h-64 object-cover rounded-lg mb-2" alt="Team 2" />
                <p className="font-bold text-[#333333]">Chef Name</p>
            </div>
            <div className="p-2 border border-gray-100 rounded-xl shadow-sm">
                <img src="/bd.jpg" className="w-full h-64 object-cover rounded-lg mb-2" alt="Team 3" />
                <p className="font-bold text-[#333333]">Chef Name</p>
            </div>
            <div className="p-2 border border-gray-100 rounded-xl shadow-sm">
                <img src="/chef.jpg" className="w-full h-64 object-cover rounded-lg mb-2" alt="Team 4" />
                <p className="font-bold text-[#333333]">Chef Name</p>
            </div>
        </div>
    )}
</div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-20 px-6 bg-[#2d1212] text-white">
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
                            {t?.nav?.map((item: any) => (
                                <a key={item.label} href="#" className="text-gray-400 hover:text-white transition-colors">
                                    {item.label}
                                </a>
                            ))}
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