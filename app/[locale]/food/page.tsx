"use client";

import { useState } from 'react';
import Header from '../../components/header';
import { messages, Language } from '../../i18n/messages';

export default function FoodPage() {
    const [lang, setLang] = useState<Language>('en');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const user = null; // Define user or fetch from auth

    const t = messages[lang];
    const toggleLang = () => setLang(lang === 'en' ? 'kh' : 'en');

    return (
        <div className={`min-h-screen bg-white text-white ${lang === 'kh' ? 'font-khmer' : 'font-sans'}`}>
            {/*Header */}
            <Header
            lang={lang}
            toggleLang={toggleLang}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            user={user}
            />
            {/*Hero banner */}
            <section className="relative min-h-[500px] flex items-center pt-20 pb-10 px-6">
                <div className="absolute inset-0 z-0">
                    <img
                    src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2000&auto=format&fit=crop"
                    className="w-full h-full object-cover dark:brightness-80"
                    alt="Hero background"
                    />
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 py-20 space-y-32">
                <section className=" gap-12 items-start">
                    <div className="space-y-6">
                        <h2 className="text-[#B99808] text-3xl font-bold">
                            {t.both}
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-4 grid-cols-2 gap-10 mt-6">
                    <button className="border-2 border-[#B99808]  text-white px-10 py-3 font-bold hover:bg-[#B99808] bg-[#B99808]/50 hover:text-white transition-all uppercase text-sm">
                        {t.all}
                    </button>
                    <button className="border-2 border-[#B99808] text-white px-10 py-3 font-bold hover:bg-[#B99808] bg-[#2d1212]/50 hover:text-white transition-all uppercase text-sm">
                        {t.factory}
                    </button>
                    <button className="border-2 border-[#B99808] text-white px-10 py-3 font-bold hover:bg-[#B99808] bg-[#2d1212]/50 hover:text-white transition-all uppercase text-sm">
                        {t.food}
                    </button>
                    <button className="border-2 border-[#B99808] text-white px-10 py-3 font-bold hover:bg-[#B99808] bg-[#2d1212]/50 hover:text-white transition-all uppercase text-sm">
                        {t.both}
                    </button>
                </div>
                </section>

               

            </main>


        </div>
    )
}
