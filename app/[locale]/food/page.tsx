"use client";

import { useState } from 'react';
import Header from '../../components/header';
import { messages, Language } from '../../i18n/messages';
import FilterButtons from '../../components/filterButtons';
import Footer from '@/app/components/footer';

// --- 1. CARD COMPONENT PROPS ---
interface EventCardProps {
    image: string[];
    title: string;
    provider: string;
    price: string;
    capacity: string | number;
    isMultiImage: boolean;
    t: any;
    lang: Language;
}

// --- 2. THE CARD COMPONENT ---
const CardItem = ({ image, title, provider, price, capacity, isMultiImage, t, lang }: EventCardProps) => {
    const handleCardClick = () => {
        // You can add navigation here, e.g., router.push('/details')
        console.log(`Clicked on ${title}`);
    };

    return (
        <div 
            onClick={handleCardClick}
            className="max-w-sm bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col h-full transition-all hover:scale-[1.03] hover:shadow-2xl cursor-pointer group"
        >
            {/* Image container */}
            <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                {isMultiImage && image.length > 1 ? (
                    <div className="flex h-full w-full gap-0.5">
                        <div className="w-1/2 h-full">
                            <img src={image[0]} alt="1" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                        </div>
                        <div className="w-1/2 h-full">
                            <img src={image[1]} alt="2" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                        </div>
                    </div>
                ) : (
                    <img src={image[0]} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                )}
            </div>

            {/* Content section */}
            <div className="p-5 flex flex-col flex-grow text-left">
                <h3 className="text-gray-900 text-lg font-bold mb-2 group-hover:text-[#B99808] transition-colors">{title}</h3>
                
                <p className="text-gray-500 text-xs mb-1">
                    {lang === 'kh' ? 'ដោយ' : 'By'} {t.from}
                </p>

                <div className="text-[#B8860B] text-2xl font-bold mb-4">
                    ${price}
                </div>

                <div className="mt-auto">
                    {/* The button now acts as a visual indicator since the whole card is clickable */}
                    <div className="w-full py-2 border border-[#B8860B] text-[#B8860B] rounded-md text-sm font-medium text-center group-hover:bg-[#B8860B] group-hover:text-white transition-colors">
                        {lang === 'kh' ? `សម្រាប់ ${capacity} នាក់` : `For ${capacity} People`}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 3. MAIN PAGE ---
export default function FoodPage() {
    const [lang, setLang] = useState<Language>('en');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [filter, setActiveFilter] = useState<'all' | 'factory' | 'food' | 'both'>('all');

    const t = messages[lang];
    const toggleLang = () => setLang(prev => (prev === 'en' ? 'kh' : 'en'));

    // Fixed Category Tags so FilterButtons work correctly
    const cardData = [
        {
            id: 1,
            titleEn: "Factory Wedding Service",
            titleKh: "សេវាកម្មរោង និងអាពាហ៍ពិពាហ៍",
            provider: t.from,
            price: "500",
            capacity: "100",
            category: 'factory' as const,
            isMultiImage: false,
            image: ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800"]
        },
        {
            id: 2,
            titleEn: "Food & Decoration Package",
            titleKh: "កញ្ចប់អាហារ និងការតុបតែង",
            provider: "សុខជា ធាវី",
            price: "1,500",
            capacity: "250",
            category: 'both' as const,
            isMultiImage: true,
            image: [
                "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800",
                "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800"
            ]
        },
        {
            id: 3,
            titleEn: "Industrial Factory Setup",
            titleKh: "សេវាកម្មរោងចក្រ",
            provider: "សុខជា ធាវី",
            price: "800",
            capacity: "500",
            category: 'factory' as const, // Changed to factory
            isMultiImage: false,
            image: ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800"]
        },
        {
            id: 4,
            titleEn: "Gourmet Food Catering",
            titleKh: "សេវាកម្មម្ហូបអាហារ",
            provider: "សុខជា ធាវី",
            price: "120",
            capacity: "200",
            category: 'food' as const, // Changed to food
            isMultiImage: false,
            image: ["https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800"]
        }
    ];

    const filteredCards = filter === 'all' 
        ? cardData 
        : cardData.filter(card => card.category === filter);

    return (
        <div className={`min-h-screen bg-gray-50 ${lang === 'kh' ? 'font-khmer' : 'font-sans'}`}>
            <Header lang={lang} toggleLang={toggleLang} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} user={null} />

            <section className="relative h-[400px] flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover brightness-50" alt="Hero" />
                <div className="relative z-10 text-center">
                    <h1 className="text-white text-5xl font-bold uppercase tracking-widest">{t.food} & {t.factory}</h1>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 py-16 justify-center justify-items-center">
                <div className="space-y-12">
                    <div className="space-y-6">
                        <h2 className="text-[#B99808] text-3xl font-bold uppercase">{t.both}</h2>
                        <FilterButtons activeFilter={filter} setActiveFilter={setActiveFilter} t={t} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 ">
                        {filteredCards.map((data) => (
                            <CardItem
                                key={data.id}
                                image={data.image}
                                title={lang === 'kh' ? data.titleKh : data.titleEn}
                                provider={data.provider}
                                price={data.price}
                                capacity={data.capacity}
                                isMultiImage={data.isMultiImage}
                                t={t}
                                lang={lang}
                            />
                        ))}
                    </div>
                </div>
            </main>
            <Footer t={t} lang={lang} />
        </div>
        
    );
}