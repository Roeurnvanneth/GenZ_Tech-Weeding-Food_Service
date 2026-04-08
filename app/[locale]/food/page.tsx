"use client";

import React, { useState, use } from 'react'; 
import Link from 'next/link';
// ១. ប្រើផ្លូវ Import ផ្ទាល់ដើម្បីជៀសវាង Error "Module not found"
import Header from '../../components/header'; 
import FilterButtons from '../../components/filterButtons';
import Footer from '../../components/footer';
import CartNotification from '../../components/CartNotification'; 
import { useWeddingData } from '../../hooks/useWeddingData'; // Import ឱ្យត្រូវ Folder
import { messages, Language } from '../../i18n/messages';
import { useCart } from '../context/CartContext'; 
import { ShoppingCart, Users, ChevronRight, Loader2 } from 'lucide-react';

// --- CARD COMPONENT ---
const CardItem = ({ product, t, lang, onAddToCart }: any) => {
    // ឆែកមើលទិន្នន័យរូបភាព និងចំណងជើងឱ្យបានច្បាស់លាស់
    const image = Array.isArray(product.images) ? product.images[0] : (product.image || product.images);
    const title = lang === 'kh' ? (product.translations?.kh?.title || product.menu_name) : (product.translations?.en?.title || product.menu_name);
    const price = product.maxPrice || product.price_usd || 0;

    return (
        <div className="group bg-white rounded-[2.5rem] p-5 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-50 flex flex-col h-full">
            <div className="relative h-56 overflow-hidden rounded-[2rem] mb-5">
                <img 
                    src={image || 'https://via.placeholder.com/400'} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-duration-700" 
                    alt={title}
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full shadow-sm">
                    <span className="text-[#B48C00] font-black text-sm">${Number(price).toFixed(2)}</span>
                </div>
            </div>

            <div className="flex-grow">
                <h3 className="text-xl font-black text-black mb-2 uppercase italic line-clamp-1">{title}</h3>
                <div className="flex items-center gap-2 text-gray-400 mb-6">
                    <Users size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                        {product.hallPrice || 0} {lang === 'kh' ? 'នាក់' : 'People'}
                    </span>
                </div>
            </div>
            
            <div className="flex gap-2">
                <button 
                    onClick={() => onAddToCart(product)}
                    className="flex-1 bg-black text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#B48C00] transition-all flex items-center justify-center gap-2"
                >
                    <ShoppingCart size={14} />
                    {lang === 'kh' ? 'បន្ថែម' : 'Add to Bag'}
                </button>
                <Link href={`/${lang}/food/${product.slug}`} className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-2xl text-gray-300 hover:text-black transition-all">
                    <ChevronRight size={20} />
                </Link>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---
export default function FoodPage({ params }: { params: Promise<{ locale: string }> }) {
    const resolvedParams = use(params);
    const lang = resolvedParams.locale as Language;
    const t = messages[lang] || messages['en'];

    // ២. ទាញទិន្នន័យតាមរយៈ Hook (Professional Step)
    const { categories, products, loading, error } = useWeddingData();

    const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');
    const [isNotifyOpen, setIsNotifyOpen] = useState(false);
    const [lastAddedProduct, setLastAddedProduct] = useState<any>(null);

    const { addToCart, totalItems } = useCart();

    const handleAddToCart = (product: any) => {
        const item = {
            id: product.id,
            menu_name: lang === 'kh' ? (product.translations?.kh?.title || product.menu_name) : (product.translations?.en?.title || product.menu_name),
            price_usd: product.maxPrice || product.price_usd || 0,
            image: Array.isArray(product.images) ? product.images[0] : (product.image || product.images)
        };
        addToCart(item); 
        setLastAddedProduct(item); 
        setIsNotifyOpen(true); 
    };

    // ៣. Filter ម្ហូប (ប្រើ Number() ដើម្បីធានាថា ID ត្រូវគ្នាជាមួយ API)
    const filteredCards = activeCategory === 'all' 
        ? products 
        : products.filter((p: any) => Number(p.categoryId) === Number(activeCategory));

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-[#B48C00] animate-spin" />
            <p className="mt-4 font-black text-gray-400 italic">LOADING DATA...</p>
        </div>
    );

    return (
        <div className={`min-h-screen bg-[#FDFDFD] ${lang === 'kh' ? 'font-khmer' : 'font-sans'}`}>
            <CartNotification 
                isOpen={isNotifyOpen}
                onClose={() => setIsNotifyOpen(false)}
                product={lastAddedProduct}
                lang={lang}
                totalItems={totalItems}
            />

            <Header lang={lang} toggleLang={() => {}} isMenuOpen={false} setIsMenuOpen={() => {}} />

            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-100 pb-8">
                    <div className="border-l-4 border-[#B48C00] pl-4">
                        <h2 className="text-2xl font-black text-black uppercase italic">Categories</h2>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Filter by your preference</p>
                    </div>
                    
                    {/* ប៊ូតុង Filter យកតាម Category ពី API */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        <button 
                            onClick={() => setActiveCategory('all')}
                            className={`px-8 py-2.5 rounded-full font-black text-[10px] uppercase transition-all ${activeCategory === 'all' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}
                        >
                            All Menu
                        </button>
                        {categories.map((cat: any) => (
                            <button 
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-8 py-2.5 rounded-full font-black text-[10px] uppercase whitespace-nowrap transition-all ${activeCategory === cat.id ? 'bg-[#B48C00] text-white' : 'bg-gray-100 text-gray-400'}`}
                            >
                                {lang === 'kh' ? (cat.name_kh || cat.name) : cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ការបង្ហាញកាតម្ហូប */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredCards.length > 0 ? (
                        filteredCards.map((product: any) => (
                            <CardItem
                                key={product.id}
                                product={product}
                                t={t}
                                lang={lang}
                                onAddToCart={handleAddToCart}
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center border-2 border-dashed border-gray-100 rounded-[3rem]">
                            <p className="text-gray-300 font-black italic text-xl uppercase italic">No Products Found</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer t={t} lang={lang} />
        </div>
    );
}