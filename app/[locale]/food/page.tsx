"use client";

import { useState, useEffect } from 'react'; 
import Link from 'next/link'; // Added this import
import Header from '../../components/header';
import { messages, Language } from '../../i18n/messages';
import FilterButtons from '../../components/filterButtons';
import Footer from '@/app/components/footer';

// --- 1. CARD COMPONENT PROPS ---
interface EventCardProps {
    image: string[];
    title: string;
    provider: string;
    price: string | number;
    capacity: string | number;
    isMultiImage: boolean;
    t: any;
    lang: Language;
}

const CardItem = ({ image, title, provider, price, capacity, isMultiImage, t, lang }: EventCardProps) => {
    return (
        <div className="max-w-sm bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col h-full transition-all hover:scale-[1.03] hover:shadow-2xl cursor-pointer group">
            <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                {isMultiImage && image?.length > 1 ? (
                    <div className="flex h-full w-full gap-0.5">
                        <div className="w-1/2 h-full"><img src={image[0]} className="w-full h-full object-cover"/></div>
                        <div className="w-1/2 h-full"><img src={image[1]} className="w-full h-full object-cover"/></div>
                    </div>
                ) : (
                    <img src={image?.[0] || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" />
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow text-left">
                <h3 className="text-gray-900 text-lg font-bold mb-2 group-hover:text-[#B99808] transition-colors">{title}</h3>
                <p className="text-gray-500 text-xs mb-1">{lang === 'kh' ? 'ដោយ' : 'By'} {provider}</p>
                <div className="text-[#B8860B] text-2xl font-bold mb-4">${price}</div>
                <div className="mt-auto">
                    <div className="w-full py-2 border border-[#B8860B] text-[#B8860B] rounded-md text-sm font-medium text-center group-hover:bg-[#B8860B] group-hover:text-white transition-colors">
                        {lang === 'kh' ? `សម្រាប់ ${capacity} នាក់` : `For ${capacity} People`}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function FoodPage() {
    const [lang, setLang] = useState<Language>('en');
    const [filter, setActiveFilter] = useState<'all' | 'factory' | 'food' | 'both'>('all');
    const [products, setProducts] = useState<any[]>([]); 
    const [loading, setLoading] = useState(true); 

    const t = messages[lang];
    const toggleLang = () => setLang(prev => (prev === 'en' ? 'kh' : 'en'));

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const result = await response.json();
                if (result.success) {
                    setProducts(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredCards = products.filter((card) => {
    // If we select 'all', show everything
    if (filter === 'all') return true;

    // Convert categoryId to number just in case it comes as a string
    const catId = Number(card.categoryId);

    if (filter === 'factory') return catId === 2;
    if (filter === 'food') return catId === 3;
    if (filter === 'both') return catId === 4;

    return false;
});


    return (
        <div className={`min-h-screen bg-gray-50 ${lang === 'kh' ? 'font-khmer' : 'font-sans'}`}>
            <Header lang={lang} toggleLang={toggleLang} isMenuOpen={false} setIsMenuOpen={() => {}} user={null} />

            <section className="relative h-[400px] flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover brightness-50" alt="Hero" />
                <div className="relative z-10 text-center">
                    <h1 className="text-white text-4xl md:text-5xl font-bold uppercase tracking-widest">{t.food} & {t.factory}</h1>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="space-y-12">
                    <div className="space-y-6">
                        <h2 className="text-[#B99808] text-3xl font-bold uppercase">{t.both}</h2>
                       <FilterButtons 
                        activeFilter={filter} 
                        setActiveFilter={setActiveFilter} 
                        t={t} 
                    />
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading products...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredCards.length > 0 ? (
                            filteredCards.map((product) => (
                                <Link 
                                    key={product.id} 
                                    href={`/${lang}/food/${product.slug}`}
                                >
                                    <CardItem
                                        image={Array.isArray(product.images) ? product.images : [product.images]}
                                        title={lang === 'kh' ? product.translations?.kh?.title : product.translations?.en?.title}
                                        provider={t.from}
                                        price={product.maxPrice}
                                        capacity={product.hallPrice} 
                                        isMultiImage={product.images?.length > 1}
                                        t={t}
                                        lang={lang}
                                    />
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-400">
                                No items found for this category.
                            </div>
                        )}
                    </div>
                )}
            </div>
            </main>
            <Footer t={t} lang={lang} />
        </div>
    );
}