"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import CartNotification from "../../components/CartNotification";
import { useWeddingData } from "../../hooks/useWeddingData";
import { messages, Language } from "../../i18n/messages";
import { useCart } from "../context/CartContext";
import { ShoppingCart, ChevronRight, Loader2 } from "lucide-react";

// ===== HELPER: Extract hallPrice from any possible API field name =====
const extractHallPrice = (product: any): number => {
  // ព្យាយាមទាញ hallPrice ពីគ្រប់ field ដែលអាចមាន
  return Number(
    product.hallPrice ||
      product.hall_price ||
      product.hall_fee ||
      product.hallFee ||
      product.decor_price ||
      product.decorPrice ||
      product.venue_price ||
      product.venuePrice ||
      0,
  );
};

// ===== CARD COMPONENT =====
const CardItem = ({ product, lang, onAddToCart }: any) => {
  const image = Array.isArray(product.images)
    ? product.images[0]
    : product.image || "https://via.placeholder.com/400";

  const foodPrice = Number(product.maxPrice || product.price_usd || 0);
  const hallPrice = extractHallPrice(product);
  const slug = product.slug || `product-${product.id}`;

  return (
    <div className="group bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden rounded-[1.5rem] mb-4">
        <img
          src={image}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          alt={slug}
        />
      </div>

      <div className="flex-grow">
        <h3 className="text-lg font-black text-slate-900 mb-4 uppercase italic line-clamp-1">
          {slug}
        </h3>

        {/* Price Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {/* Food Price */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1 truncate">
              {lang === "kh" ? "តម្លៃម្ហូប/តុ" : "Food Price"}
            </span>
            <span className="text-[#B48C00] font-black text-sm">
              ${foodPrice.toFixed(2)}
            </span>
          </div>

          {/* Hall & Decor Price */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1 truncate">
              {lang === "kh" ? "តម្លៃរោង/តុបតែង" : "Hall & Decor"}
            </span>
            <span className="text-[#B48C00] font-black text-sm">
              +${hallPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onAddToCart(product)}
          className="flex-[3] bg-black text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#B48C00] transition-all flex items-center justify-center gap-2"
        >
          <ShoppingCart size={12} />
          {lang === "kh" ? "បន្ថែម" : "Add"}
        </button>
        <Link
          href={`/${lang}/food/${product.slug}`}
          className="flex-1 bg-gray-50 flex items-center justify-center rounded-xl text-gray-400 hover:text-black transition-all"
        >
          <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );
};

// ===== MAIN PAGE =====
export default function FoodPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = use(params);
  const lang = resolvedParams.locale as Language;
  const t = messages[lang] || messages["en"];

  const { categories, products, loading, error } = useWeddingData();
  const [activeCategory, setActiveCategory] = useState<number | "all">("all");
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<any>(null);
  const { addToCart, totalItems } = useCart();

  const handleAddToCart = (product: any) => {
    // ទាញ hallPrice ឱ្យបានត្រូវ មុនបញ្ជូនទៅ Cart
    const hallPrice = extractHallPrice(product);

    const item = {
      id: product.id,
      menu_name:
        lang === "kh"
          ? product.translations?.kh?.title || product.menu_name
          : product.translations?.en?.title || product.menu_name,
      price_usd: Number(product.maxPrice || product.price_usd || 0),
      hallPrice: hallPrice, // ✅ បញ្ជូន hallPrice ត្រូវ
      image: Array.isArray(product.images)
        ? product.images[0]
        : product.image || product.images,
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

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#B48C00] animate-spin" />
        <p className="mt-4 font-black text-gray-400 italic">LOADING DATA...</p>
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="font-black text-red-400 italic">ERROR: {String(error)}</p>
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


      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Header + Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-100 pb-8">
          <div className="border-l-4 border-[#B48C00] pl-4">
            <h2 className="text-2xl font-black text-black uppercase italic">
              Categories
            </h2>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              Filter by your preference
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-8 py-2.5 rounded-full font-black text-[10px] uppercase transition-all whitespace-nowrap ${
                activeCategory === "all"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              All Menu
            </button>
            {categories.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-8 py-2.5 rounded-full font-black text-[10px] uppercase whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-[#B48C00] text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {lang === "kh" ? cat.name_kh || cat.name : cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
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
              <p className="text-gray-300 font-black italic text-xl uppercase">
                No Products Found
              </p>
            </div>
          )}
        </div>
      </main>

      
    </div>
  );
}
