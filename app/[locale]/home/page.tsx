"use client";

import { useState, useEffect } from "react";
import { Utensils, Calendar } from "lucide-react";
import { messages, Language } from "../../i18n/messages";
import FoodGallery from "@/app/components/card";

interface HomePageProps {
  lang: string;
}

export default function HomePageContent({ lang }: HomePageProps) {
  const currentLang = (lang === "kh" ? "kh" : "en") as Language;
  const t = messages[currentLang];

  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing user data", error);
      }
    }
  }, []);

  // កែសម្រួល href ឱ្យទៅកាន់ទំព័រ food ទាំងអស់គ្នា
  const catering = [
    {
      src: "/ka.jpg",
      label: t.factory,
      href: `/${currentLang}/food`, // ផ្លាស់ប្តូរពី factory ទៅ food
      className: "font-bold",
    },
    {
      src: "/bun.jpg",
      label: t.food,
      href: `/${currentLang}/food`, // ផ្លាស់ប្តូរពី food ទៅ food
      className: "font-bold",
    },
    {
      src: "/wedding.jpg",
      label: t.both,
      href: `/${currentLang}/food`, // ផ្លាស់ប្តូរពី both ទៅ food
      className: "font-bold",
    },
  ];

  return (
    <div
      className={`min-h-screen bg-white text-white ${currentLang === "kh" ? "font-khmer" : "font-sans"}`}
    >
      {/* Hero Section */}
      <header className="relative min-h-[500px] flex items-center pt-20 pb-10 px-6">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2000"
            className="w-full h-full object-cover brightness-50"
            alt="Hero background"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-white text-4xl md:text-6xl font-bold tracking-widest">
              {t.heroTitle}
            </h2>
            <h1 className="text-xl md:text-3xl font-extrabold leading-tight">
              {t.heroSub}
            </h1>
            <a
              href={`/${currentLang}/booking`}
              className="inline-block border-2 border-[#B99808] text-white px-10 py-3 font-bold hover:bg-[#B99808] bg-[#2d1212]/50 transition-all uppercase text-sm"
            >
              {t.btnMore}
            </a>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 text-center px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
          {t.heading}
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-xl leading-relaxed">
          {t.peading}
        </p>

        <div className="max-w-7xl mx-auto mt-16 grid md:grid-cols-2 gap-16">
          <div className="flex flex-col items-center gap-4">
            <Utensils className="w-16 h-16 text-[#333333]" />
            <h3 className="text-2xl font-bold text-[#333333]">
              {t.professionalchef}
            </h3>
            <p className="text-gray-400 max-w-sm">{t.experince}</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Calendar className="w-16 h-16 text-[#333333]" />
            <h3 className="text-2xl font-bold text-[#333333]">
              {t.prepareallprograms}
            </h3>
            <p className="text-gray-400 max-w-sm">{t.event}</p>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="relative py-20 text-center">
        <div className="absolute inset-0 z-0 bg-[#1A0B0B]">
          <div className="absolute inset-0 bg-[#3d1a1a]/40 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-gray-300 font-bold mb-2">{t.stats.food}</h4>
            <p className="text-4xl font-black text-[#B99808]">100+</p>
          </div>
          <div>
            <h4 className="text-gray-300 font-bold mb-2">{t.stats.branch}</h4>
            <p className="text-4xl font-black text-[#B99808]">15</p>
          </div>
          <div>
            <h4 className="text-gray-300 font-bold mb-2">{t.stats.staff}</h4>
            <p className="text-4xl font-black text-[#B99808]">50+</p>
          </div>
          <div>
            <h4 className="text-gray-300 font-bold mb-2">{t.stats.happy}</h4>
            <p className="text-4xl font-black text-[#B99808]">98%</p>
          </div>
        </div>
      </section>

      {/* Catering Gallery */}
      <section className="py-20 text-center px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#333333] mb-10">
          {t.cateringservice}
        </h1>
        <FoodGallery images={catering} />
      </section>
    </div>
  );
}
