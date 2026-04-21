"use client";

import React from 'react';
import Link from 'next/link'; 
import { MapPin, Phone, Send } from 'lucide-react';
import { messages, Language } from '../i18n/messages';

interface FooterProps {
    lang: Language;
}

export default function Footer({ lang }: FooterProps) {
    const t = messages[lang];

    return (
        <footer className="py-20 px-6 bg-[#2d1212] text-white">
            {/* --- Changed to grid-cols-3 for equal balance --- */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 items-start">
                
                {/* Column 1: Brand Section */}
                <div className="flex flex-col space-y-6">
                    <h3 className="text-2xl font-bold text-[#B99808]">{t.heroTitle}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {t.attractive || "Providing premium catering and wedding food services for your special moments."}
                    </p>
                    <div className="flex gap-4 pt-2">
                        <a href="tel:0967932352" className="bg-[#B99808] p-3 rounded-xl hover:bg-white hover:text-[#B99808] transition-all duration-300">
                            <Phone size={18} />
                        </a>
                        <a href="https://t.me/LYZA2701" target="_blank" className="bg-[#B99808] p-3 rounded-xl hover:bg-white hover:text-[#B99808] transition-all duration-300">
                            <Send size={18} className="rotate-[-20deg]" />
                        </a>
                    </div>
                </div>
                
                {/* Column 2: Quick Links (Now in the center) */}
                <div className="flex flex-col space-y-6 md:items-center">
                    <div className="w-fit"> {/* Wrapper to keep text aligned left but container centered */}
                        <h4 className="text-sm font-black text-[#B99808] uppercase tracking-[0.2em] mb-6">
                            {lang === 'en' ? 'Quick Links' : 'តំណភ្ជាប់រហ័ស'}
                        </h4>
                        <nav className="flex flex-col gap-4">
                            {t?.nav?.map((item: { label: string; path: string }) => (
                                <Link 
                                    key={item.label} 
                                    href={`/${lang}/${item.path}`}
                                    className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Column 3: Contact Details (Aligned to the right) */}
                <div className="flex flex-col space-y-6 text-sm text-gray-400 lg:items-end">
                    <div className="w-full lg:max-w-[250px]">
                        <h4 className="text-sm font-black text-[#B99808] uppercase tracking-[0.2em] mb-6">
                            {lang === 'en' ? 'Get In Touch' : 'ព័ត៌មានទំនាក់ទំនង'}
                        </h4>
                        <div className="space-y-5">
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-[#B99808] shrink-0 mt-1" /> 
                                <p className="leading-relaxed">{t.location}</p>
                            </div>
                            <div className="flex items-center gap-3">
                            <a href="tel:0967932352">
                                <Phone size={18} className="text-[#B99808]" /> 
                            </a>
                            <a href="tel:0967932352">
                                <p>096 793 2352</p>
                            </a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            
            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                <p>© {new Date().getFullYear()} {t.heroTitle}. All Rights Reserved.</p>
                <div className="flex gap-6">
                    <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                    <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
                </div>
            </div>
        </footer>
    );
}