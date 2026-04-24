"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import CartNotification from "../../components/CartNotification";
import { useWeddingData } from "../../hooks/useWeddingData";
import { messages, Language } from "../../i18n/messages";
import { useCart } from "../context/CartContext";
import {
  ShoppingCart,
  ChevronRight,
  UtensilsCrossed,
  Building2,
} from "lucide-react";

// ── Save to: app/[locale]/food/page.tsx ──────────────────────────────────────
// ── Detail page lives at: app/[locale]/foodDetail/[slug]/page.tsx ────────────
// ── Link between them: /${lang}/foodDetail/${slug} ───────────────────────────

// ── helpers ───────────────────────────────────────────────────────────────────

function getApiLangKey(lang: string): string {
  return lang === "kh" ? "kh" : "en";
}

function extractHallPrice(product: any): number {
  return Number(product.hallPrice || 0);
}

function getProductImage(product: any): string {
  if (Array.isArray(product.images) && product.images.length > 0)
    return product.images[0];
  if (product.image) return product.image;
  return "https://placehold.co/400x300/111/gold?text=No+Image";
}

function getProductTitle(product: any, apiLang: string): string {
  const tr =
    product.translations?.[apiLang] ?? product.translations?.["en"] ?? {};
  return tr.name || product.menu_name || product.slug || "Untitled";
}

// ── card component ────────────────────────────────────────────────────────────

const CardItem = ({
  product,
  lang,
  onAddToCart,
}: {
  product: any;
  lang: Language;
  onAddToCart: (product: any) => void;
}) => {
  const apiLang = getApiLangKey(lang);
  const image = getProductImage(product);
  const title = getProductTitle(product, apiLang);
  const foodPrice = Number(product.maxPrice || product.price || 0);
  const hallPrice = extractHallPrice(product);
  const slug = encodeURIComponent(product.slug || `product-${product.id}`);

  return (
    <div className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full">
      {/* ── image + hover overlay ── */}
      <Link
        href={`/${lang}/foodDetail/${slug}`}
        className="relative h-52 overflow-hidden block"
      >
        <img
          src={image}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt={title}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/400x300/111/gold?text=No+Image";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <span className="bg-[#B48C00] text-black text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
            {lang === "kh" ? "មើលលម្អិត" : "View Detail"}
          </span>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base font-black text-slate-900 mb-3 uppercase italic line-clamp-2 leading-tight">
          {title}
        </h3>

        <div className="grid grid-cols-2 gap-2 mb-4 flex-grow">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="flex items-center gap-1 mb-1">
              <UtensilsCrossed size={9} className="text-slate-400" />
              <span className="text-[8px] font-bold text-slate-400 uppercase truncate">
                {lang === "kh" ? "ម្ហូប/តុ" : "Food/Table"}
              </span>
            </div>
            <span className="text-[#B48C00] font-black text-sm">
              ${foodPrice.toFixed(2)}
            </span>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="flex items-center gap-1 mb-1">
              <Building2 size={9} className="text-slate-400" />
              <span className="text-[8px] font-bold text-slate-400 uppercase truncate">
                {lang === "kh" ? "រោង/តុបតែង" : "Hall & Decor"}
              </span>
            </div>
            <span className="text-[#B48C00] font-black text-sm">
              +${hallPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">
            {lang === "kh" ? "សរុប/តុ" : "Total/table"}
          </span>
          <span className="text-sm font-black text-slate-800">
            ${(foodPrice + hallPrice).toFixed(2)}
          </span>
        </div>

        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onAddToCart(product)}
            className="flex-[3] bg-black text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#B48C00] hover:text-black transition-all duration-300 flex items-center justify-center gap-1.5"
          >
            <ShoppingCart size={12} />
            {lang === "kh" ? "បន្ថែម" : "Add"}
          </button>
          {/* ✅ CORRECT: Navigates to foodDetail/[slug] page */}
          <Link
            href={`/${lang}/foodDetail/${slug}`}
            className="flex-1 bg-gray-50 border border-gray-100 flex items-center justify-center rounded-xl text-gray-400 hover:text-[#B48C00] hover:border-[#B48C00]/30 transition-all duration-300"
          >
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

// ── skeleton card ─────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="animate-pulse bg-white rounded-[2rem] overflow-hidden border border-gray-100">
    <div className="h-52 bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="grid grid-cols-2 gap-2">
        <div className="h-14 bg-gray-100 rounded-xl" />
        <div className="h-14 bg-gray-100 rounded-xl" />
      </div>
      <div className="h-10 bg-gray-200 rounded-xl" />
    </div>
  </div>
);

// ── main page ─────────────────────────────────────────────────────────────────

export default function FoodPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = use(params);
  const lang = resolvedParams.locale as Language;

  const { categories, products, loading, error } = useWeddingData();
  const [activeCategory, setActiveCategory] = useState<number | "all">("all");
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<any>(null);
  const { addToCart, totalItems } = useCart();

  const apiLang = getApiLangKey(lang);

  const handleAddToCart = (product: any) => {
    const tr =
      product.translations?.[apiLang] ?? product.translations?.["en"] ?? {};
    const item = {
      id: product.id,
      menu_name: tr.name || product.menu_name || product.slug,
      price_usd: Number(product.maxPrice || product.price || 0),
      hallPrice: extractHallPrice(product),
      image: getProductImage(product),
    };
    addToCart(item);
    setLastAddedProduct(item);
    setIsNotifyOpen(true);
  };

  const filteredCards =
    activeCategory === "all"
      ? products
      : products.filter(
          (p: any) => Number(p.categoryId) === Number(activeCategory),
        );

  if (error)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-black text-red-400 italic text-xl uppercase">
          Error Loading
        </p>
        <p className="text-gray-400 text-sm">{String(error)}</p>
      </div>
    );

  return (
    <div
      className={`min-h-screen bg-[#FDFDFD] ${lang === "kh" ? "font-khmer" : "font-sans"}`}
    >
      <CartNotification
        isOpen={isNotifyOpen}
        onClose={() => setIsNotifyOpen(false)}
        product={lastAddedProduct}
        lang={lang}
        totalItems={totalItems}
      />

      {/* Hero Banner */}
      <section className="relative h-[400px] flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="/mhub.jpg"
            className="w-full h-full object-cover"
            alt="About hero"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-100 pb-8">
          <div className="border-l-4 border-[#B48C00] pl-4">
            <h2 className="text-2xl font-black text-black uppercase italic">
              {lang === "kh" ? "ម្ហូបអាហារ" : "Our Menu"}
            </h2>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              {lang === "kh" ? "ជ្រើសរើសតាមចំណង់" : "Filter by your preference"}
            </p>
          </div>

          <Link
            href={`/${lang}/cart`}
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#B48C00] transition-all self-start md:self-auto"
          >
            <ShoppingCart size={13} />
            {lang === "kh" ? "កន្ត្រក" : "Cart"}
            {totalItems > 0 && (
              <span className="bg-[#B48C00] text-black w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-10 no-scrollbar">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-6 py-2.5 rounded-full font-black text-[10px] uppercase transition-all whitespace-nowrap border ${
              activeCategory === "all"
                ? "bg-black text-white border-black"
                : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"
            }`}
          >
            {lang === "kh" ? "ទាំងអស់" : "All Menu"}
          </button>
          {categories.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full font-black text-[10px] uppercase whitespace-nowrap transition-all border ${
                activeCategory === cat.id
                  ? "bg-[#B48C00] text-black border-[#B48C00]"
                  : "bg-white text-gray-400 border-gray-200 hover:border-[#B48C00]/50"
              }`}
            >
              {lang === "kh" ? cat.name_kh || cat.name : cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredCards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCards.map((product: any) => (
              <CardItem
                key={product.id}
                product={product}
                lang={lang}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center border-2 border-dashed border-gray-100 rounded-[3rem]">
            <UtensilsCrossed size={40} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-300 font-black italic text-xl uppercase">
              {lang === "kh" ? "រកមិនឃើញ" : "No Products Found"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
