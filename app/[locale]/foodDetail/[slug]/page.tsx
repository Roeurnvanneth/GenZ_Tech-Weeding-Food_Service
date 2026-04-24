"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Language } from "../../../i18n/messages";
import { useCart } from "../../context/CartContext";
import {
    ShoppingCart,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Play,
    X,
    Check,
    UtensilsCrossed,
    Building2,
    Heart,
    Share2,
    Clock,
    MapPin,
    ChefHat,
    Star,
    Minus,
    Plus,
    Sparkles,
} from "lucide-react";

// ── Save to: app/[locale]/foodDetail/[slug]/page.tsx ─────────────────────────

function getApiLangKey(lang: string): string {
    return lang === "kh" ? "kh" : "en";
}

function extractHallPrice(product: any): number {
    return Number(product.hallPrice || 0);
}

function getImages(product: any): string[] {
    if (Array.isArray(product.images) && product.images.length > 0) return product.images;
    if (product.image) return [product.image];
    return ["https://placehold.co/1200x800/F5F5F5/333333?text=No+Image"];
}

export default function FoodDetailPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = use(params);
    const lang = (locale === "en" || locale === "kh" ? locale : "en") as Language;
    const apiLang = getApiLangKey(lang);
    const { addToCart, totalItems } = useCart();

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeImg, setActiveImg] = useState(0);
    const [showVideo, setShowVideo] = useState(false);
    const [lightbox, setLightbox] = useState(false);
    const [added, setAdded] = useState(false);
    const [liked, setLiked] = useState(false);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const decodedSlug = decodeURIComponent(slug);
                const res = await fetch(`/api/products`);
                const json = await res.json();

                if (json.success && Array.isArray(json.data)) {
                    const foundProduct = json.data.find(
                        (p: any) => decodeURIComponent(p.slug) === decodedSlug || p.id === parseInt(decodedSlug)
                    );
                    if (foundProduct) {
                        setProduct(foundProduct);
                    } else {
                        setError("Product not found");
                    }
                } else {
                    setError("Failed to load products");
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Failed to load product");
            } finally {
                setLoading(false);
            }
        })();
    }, [slug]);

    const handleAddToCart = () => {
        if (!product) return;
        const translations = product.translations || {};
        const currentLangData = translations[apiLang] || translations.en || {};
        const productName = currentLangData.name || product.slug || "Product";
        
        for (let i = 0; i < quantity; i++) {
            addToCart({
                id: product.id,
                menu_name: productName,
                price_usd: Number(product.maxPrice || product.price || 0),
                hallPrice: extractHallPrice(product),
                image: getImages(product)[0],
            });
        }
        setAdded(true);
        setTimeout(() => setAdded(false), 2500);
    };

    useEffect(() => {
        if (!lightbox) return;
        const images = product ? getImages(product) : [];
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") setActiveImg(i => (i + 1) % images.length);
            if (e.key === "ArrowLeft") setActiveImg(i => (i - 1 + images.length) % images.length);
            if (e.key === "Escape") setLightbox(false);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [lightbox, product]);

    const images = product ? getImages(product) : [];
    const translations = product?.translations || {};
    const currentLangData = translations[apiLang] || translations.en || {};
    const title = currentLangData.name || product?.slug || "Product";
    const description = currentLangData.description || "";
    const foodPrice = Number(product?.maxPrice || product?.price || 0);
    const hallPrice = product ? extractHallPrice(product) : 0;
    const totalPrice = (foodPrice + hallPrice) * quantity;
    const videoUrl = product?.videoUrl || null;
    const categoryName = product?.category?.translations?.[apiLang]?.name || product?.category?.name || null;

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <div className="w-14 h-14 border-2 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[#333333] text-sm font-medium tracking-wider">
                    {lang === "kh" ? "កំពុងផ្ទុក..." : "Loading..."}
                </p>
            </div>
        </div>
    );

    if (error || !product) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 p-4">
            <div className="w-20 h-20 rounded-full bg-[#FFD700]/10 flex items-center justify-center">
                <UtensilsCrossed size={36} className="text-[#FFD700]/60" />
            </div>
            <p className="text-red-500 font-medium text-lg">{error || "Not Found"}</p>
            <Link
                href={`/${lang}/food`}
                className="flex items-center gap-2 bg-[#FFD700] text-black px-6 py-3 rounded-full text-sm font-medium hover:bg-[#E6C200] transition-all"
            >
                <ArrowLeft size={16} />
                {lang === "kh" ? "ត្រឡប់ទៅកាន់ម៉ឺនុយ" : "Back to Menu"}
            </Link>
        </div>
    );

    return (
        <div className={`min-h-screen bg-white text-[#1A1A1A] ${lang === "kh" ? "font-khmer" : "font-sans"}`}>
            {/* LIGHTBOX MODAL */}
            {lightbox && images.length > 0 && (
                <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center" onClick={() => setLightbox(false)}>
                    <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white">
                        <X size={18} />
                    </button>
                    <button 
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-[#FFD700] hover:text-black flex items-center justify-center transition-all text-white"
                        onClick={(e) => { e.stopPropagation(); setActiveImg(i => (i - 1 + images.length) % images.length); }}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <img 
                        src={images[activeImg]} 
                        className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl" 
                        alt={title} 
                        onClick={(e) => e.stopPropagation()} 
                    />
                    <button 
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-[#FFD700] hover:text-black flex items-center justify-center transition-all text-white"
                        onClick={(e) => { e.stopPropagation(); setActiveImg(i => (i + 1) % images.length); }}
                    >
                        <ChevronRight size={18} />
                    </button>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, i) => (
                            <button 
                                key={i} 
                                onClick={(e) => { e.stopPropagation(); setActiveImg(i); }}
                                className={`h-1 rounded-full transition-all ${i === activeImg ? "bg-[#FFD700] w-6" : "bg-white/30 w-1.5"}`} 
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* TOP NAVIGATION BAR */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#FFD700]/20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
                    <Link href={`/${lang}/food`} className="flex items-center gap-2 text-[#666666] hover:text-[#FFD700] transition-colors group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                        <span className="text-xs font-medium">{lang === "kh" ? "ត្រឡប់" : "Back"}</span>
                    </Link>
                    
                    <div className="flex items-center gap-1">
                        <button onClick={() => setLiked(!liked)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <Heart size={16} className={liked ? "fill-[#FFD700] text-[#FFD700]" : "text-[#666666]"} />
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <Share2 size={16} className="text-[#666666]" />
                        </button>
                        <Link href={`/${lang}/cart`} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <ShoppingCart size={16} className="text-[#666666]" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#FFD700] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <main className="max-w-7xl mx-auto px-4 md:px-6 pt-20 pb-28">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* LEFT - IMAGE GALLERY */}
                    <div className="space-y-3">
                        {/* Main Image */}
                        <div className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-md">
                            {showVideo && videoUrl ? (
                                <div className="aspect-[4/3] w-full">
                                    <video src={videoUrl} controls autoPlay className="w-full h-full object-cover" />
                                    <button 
                                        onClick={() => setShowVideo(false)} 
                                        className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 transition-colors text-white"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div className="relative group">
                                    <img 
                                        src={images[activeImg]} 
                                        className="w-full aspect-[4/3] object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-[1.02]" 
                                        alt={title} 
                                        onClick={() => setLightbox(true)} 
                                    />
                                    
                                    {images.length > 1 && (
                                        <>
                                            <button 
                                                onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)} 
                                                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-[#FFD700] hover:text-black transition-all opacity-0 group-hover:opacity-100 text-white"
                                            >
                                                <ChevronLeft size={14} />
                                            </button>
                                            <button 
                                                onClick={() => setActiveImg(i => (i + 1) % images.length)} 
                                                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-[#FFD700] hover:text-black transition-all opacity-0 group-hover:opacity-100 text-white"
                                            >
                                                <ChevronRight size={14} />
                                            </button>
                                        </>
                                    )}
                                    
                                    {videoUrl && (
                                        <button 
                                            onClick={() => setShowVideo(true)} 
                                            className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#FFD700] text-black text-[9px] font-bold uppercase px-2.5 py-1.5 rounded-full hover:bg-[#E6C200] transition-all shadow-md"
                                        >
                                            <Play size={9} fill="black" /> Watch Video
                                        </button>
                                    )}
                                    
                                    {images.length > 1 && (
                                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur text-white text-[9px] font-medium px-2 py-1 rounded-full">
                                            {activeImg + 1}/{images.length}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {(images.length > 1 || videoUrl) && (
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {images.slice(0, 4).map((img, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => { setActiveImg(i); setShowVideo(false); }}
                                        className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                            activeImg === i && !showVideo 
                                                ? "border-[#FFD700] shadow-md" 
                                                : "border-gray-200 hover:border-[#FFD700]/50"
                                        }`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${i + 1}`} />
                                    </button>
                                ))}
                                {videoUrl && (
                                    <button 
                                        onClick={() => setShowVideo(true)} 
                                        className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                            showVideo ? "border-[#FFD700] shadow-md" : "border-gray-200 hover:border-[#FFD700]/50"
                                        }`}
                                    >
                                        <img src={images[0] || "/placeholder.jpg"} className="w-full h-full object-cover brightness-75" alt="Video thumbnail" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Play size={12} fill="black" className="ml-0.5 text-black" />
                                        </div>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* RIGHT - PRODUCT INFO */}
                    <div className="space-y-5">
                        {/* Category & ID */}
                        <div className="flex items-center gap-3 flex-wrap">
                            {categoryName && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD700] bg-[#FFD700]/10 px-3 py-1 rounded-full">
                                    {categoryName}
                                </span>
                            )}
                            <span className="text-[10px] text-gray-400 font-mono">ID: {product?.id}</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-black leading-tight tracking-tight">
                            {title}
                        </h1>

                        {/* Rating & Time */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <Star size={14} className="text-[#FFD700] fill-[#FFD700]" />
                                <span className="font-medium text-black text-sm">4.9</span>
                                <span className="text-gray-400 text-xs">(128 reviews)</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                            <div className="flex items-center gap-1">
                                <Clock size={12} className="text-gray-400" />
                                <span className="text-gray-500 text-xs">30-45 min</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles size={14} className="text-[#FFD700]" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD700]">
                                    {lang === "kh" ? "ព័ត៌មានលម្អិត" : "Description"}
                                </span>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {description || (lang === "kh" 
                                    ? "ព័ត៌មានលម្អិតអំពីមុខម្ហូបនេះនឹងបង្ហាញនៅទីនេះ។ សូមរង់ចាំការអាប់ដេត។" 
                                    : "Product details will appear here. Please check back later.")}
                            </p>
                        </div>

                        {/* Price Breakdown */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <div className="flex items-center gap-1.5 text-[#FFD700] mb-2">
                                    <UtensilsCrossed size={12} />
                                    <span className="text-[9px] font-bold uppercase tracking-wider">
                                        {lang === "kh" ? "ម្ហូបអាហារ" : "Food"}
                                    </span>
                                </div>
                                <p className="text-black font-bold text-xl">${foodPrice.toFixed(2)}</p>
                                <p className="text-gray-400 text-[9px] mt-1">
                                    {lang === "kh" ? "ក្នុង ១ តុ" : "per table"}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <div className="flex items-center gap-1.5 text-[#FFD700] mb-2">
                                    <Building2 size={12} />
                                    <span className="text-[9px] font-bold uppercase tracking-wider">
                                        {lang === "kh" ? "សាល + តុបតែង" : "Hall + Decor"}
                                    </span>
                                </div>
                                <p className="text-black font-bold text-xl">+${hallPrice.toFixed(2)}</p>
                                <p className="text-gray-400 text-[9px] mt-1">
                                    {lang === "kh" ? "ក្នុង ១ តុ" : "per table"}
                                </p>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-6 py-2">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {lang === "kh" ? "ចំនួនតុ:" : "Quantity:"}
                            </span>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center hover:bg-[#FFD700] hover:text-black transition-colors text-black"
                                >
                                    <Minus size={12} />
                                </button>
                                <span className="text-black font-semibold w-8 text-center text-lg">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center hover:bg-[#FFD700] hover:text-black transition-colors text-black"
                                >
                                    <Plus size={12} />
                                </button>
                            </div>
                        </div>

                        {/* Total & Add to Cart */}
                        <div className="bg-gradient-to-r from-[#FFD700]/5 to-transparent rounded-xl p-5 border border-[#FFD700]/20 mt-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                        {lang === "kh" ? "សរុបទឹកប្រាក់" : "Total Amount"}
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-black">${totalPrice.toFixed(2)}</span>
                                        <span className="text-gray-400 text-xs">
                                            {lang === "kh" ? `សម្រាប់ ${quantity} តុ` : `for ${quantity} table${quantity !== 1 ? 's' : ''}`}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-[9px] mt-1">
                                        ${foodPrice.toFixed(2)} {lang === "kh" ? "ម្ហូប" : "food"} + ${hallPrice.toFixed(2)} {lang === "kh" ? "សាល" : "hall"} × {quantity}
                                    </p>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                                        added 
                                            ? "bg-green-500 text-white" 
                                            : "bg-[#FFD700] text-black hover:bg-[#E6C200] hover:scale-[1.02] shadow-md"
                                    }`}
                                >
                                    {added ? <Check size={14} /> : <ShoppingCart size={14} />}
                                    {added 
                                        ? (lang === "kh" ? "បានបន្ថែម!" : "Added!") 
                                        : (lang === "kh" ? "បន្ថែមទៅកន្ត្រក" : "Add to Cart")}
                                </button>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="flex items-center gap-2 text-gray-500">
                                <ChefHat size={14} className="text-[#FFD700]" />
                                <span className="text-xs">{lang === "kh" ? "គុណភាពខ្ពស់" : "Premium Quality"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                                <MapPin size={14} className="text-[#FFD700]" />
                                <span className="text-xs">{lang === "kh" ? "ត្រៀមព្រឹត្តិការណ៍" : "Event Ready"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* MOBILE BOTTOM BAR */}
            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#FFD700]/20 px-4 py-3 flex items-center justify-between shadow-lg">
                <div>
                    <p className="text-[9px] text-gray-400 font-medium uppercase">
                        {lang === "kh" ? "សរុប" : "Total"}
                    </p>
                    <p className="text-black font-bold text-xl">${totalPrice.toFixed(2)}</p>
                </div>
                <button
                    onClick={handleAddToCart}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                        added ? "bg-green-500 text-white" : "bg-[#FFD700] text-black"
                    }`}
                >
                    {added ? <Check size={12} /> : <ShoppingCart size={12} />}
                    {added ? (lang === "kh" ? "បានបន្ថែម" : "Added") : (lang === "kh" ? "បន្ថែម" : "Add")}
                </button>
            </div>
        </div>
    );
}