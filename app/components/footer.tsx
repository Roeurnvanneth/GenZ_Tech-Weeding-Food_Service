import React from 'react';
import { MapPin, Phone, Send } from 'lucide-react';
import { messages, Language } from '../i18n/messages';

interface FooterProps {
    lang: Language;
}

export default function Footer({ lang }: FooterProps) {
    const t = messages[lang];

    return (
      <>
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
              {t?.nav?.map((item: { label: string }) => (
                <a key={item.label} href="#" className="text-gray-400 hover:text-white">
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
      </>
    );
}