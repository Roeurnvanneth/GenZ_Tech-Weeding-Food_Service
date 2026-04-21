"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Header from '../../../components/header';
import Footer from '../../../components/footer';
import CartNotification from '../../../components/CartNotification';
import { messages, Language } from '../../../i18n/messages';
import { useCart } from '../../context/CartContext';
import {
  ShoppingCart, Users, ArrowLeft, Loader2,
  Utensils, ChefHat, Star, Calendar, Tag,
  DollarSign, BookOpen, CheckCircle, ImageOff,
  ChevronLeft, ChevronRight
} from 'lucide-react';

// =============================================
// TYPES
// =============================================
interface TabData {
  menus: any[];
  catering: any[];
  cateringStandards: any[];
  eventTypes: any[];
}

const TABS = [
  { key: 'menus',             label: { kh: 'មុខម្ហូប',               en: 'Menus'              }, icon: Utensils },
  { key: 'catering',          label: { kh: 'សេវាចម្អិន',             en: 'Catering'           }, icon: ChefHat  },
  { key: 'cateringStandards', label: { kh: 'ស្តង់ដារចម្អិន',         en: 'Catering Standards' }, icon: Star     },
  { key: 'eventTypes',        label: { kh: 'ប្រភេទព្រឹត្តិការណ៍',    en: 'Event Types'        }, icon: Calendar },
];

// =============================================
// TAB CARD
// =============================================
function TabCard({ item, tabKey, isKh }: { item: any; tabKey: string; isKh: boolean }) {
  const name = isKh
    ? (item.name_kh || item.translations?.kh?.title || item.name || item.title || item.menu_name || '—')
    : (item.name_en || item.translations?.en?.title || item.name || item.title || item.menu_name || '—');
  const description = isKh
    ? (item.description_kh || item.translations?.kh?.description || item.description || '')
    : (item.description_en || item.translations?.en?.description || item.description || '');
  const price = item.price_usd || item.price || item.maxPrice || null;

  const IconMap: Record<string, React.ReactNode> = {
    menus:             <Utensils size={15} className="text-[#B48C00]" />,
    catering:          <ChefHat  size={15} className="text-[#B48C00]" />,
    cateringStandards: <Star     size={15} className="text-[#B48C00]" />,
    eventTypes:        <Calendar size={15} className="text-[#B48C00]" />,
  };

  return (
    <div className="group bg-slate-50 hover:bg-white border border-slate-100 hover:border-amber-200/60 hover:shadow-md rounded-2xl p-5 transition-all duration-300 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#B48C00]/10 flex items-center justify-center flex-shrink-0">
            {IconMap[tabKey]}
          </div>
          <h4 className="font-black text-slate-800 text-sm leading-tight line-clamp-2 group-hover:text-[#5C1A0B] transition-colors">
            {name}
          </h4>
        </div>
        {price && (
          <span className="flex-shrink-0 bg-emerald-50 border border-emerald-100 text-emerald-600 font-black text-xs px-2.5 py-1 rounded-full">
            ${Number(price).toFixed(2)}
          </span>
        )}
      </div>
      {description && (
        <p className="text-slate-400 text-xs leading-relaxed font-medium line-clamp-3">{description}</p>
      )}
      {item.standard && (
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#B48C00]">
          <CheckCircle size={11} /> {item.standard}
        </div>
      )}
      {item.event_type && (
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <Calendar size={11} /> {item.event_type}
        </div>
      )}
    </div>
  );
}

// =============================================
// MAIN DETAIL PAGE
// =============================================
export default function FoodDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const resolvedParams = use(params);
  const lang = resolvedParams.locale as Language;
  const slug = resolvedParams.slug;
  const isKh = lang === 'kh';
  const t = messages[lang] || messages['en'];

  const [product, setProduct] = useState<any>(null);
  const [tabData, setTabData] = useState<TabData>({
    menus: [], catering: [], cateringStandards: [], eventTypes: []
  });
  const [activeTab, setActiveTab] = useState('menus');
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingTabs, setLoadingTabs] = useState(true);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const { addToCart, totalItems } = useCart();

  // ---- Fetch product by slug ----
  useEffect(() => {
    const fetchProduct = async () => {
      setLoadingProduct(true);
      try {
        const res = await fetch(`/api/menus/${slug}`);
        const json = await res.json();
        setProduct(json.data || json);
      } catch (e) {
        console.error('Failed to fetch product', e);
      } finally {
        setLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // ---- Fetch all 4 tab APIs in parallel ----
  useEffect(() => {
    const fetchAllTabs = async () => {
      setLoadingTabs(true);
      try {
        const [menusRes, cateringRes, standardsRes, eventRes] = await Promise.all([
          fetch('/api/menus'),
          fetch('/api/catering'),
          fetch('/api/catering-stanndards'),
          fetch('/api/evert-type'),
        ]);
        const [menusJson, cateringJson, standardsJson, eventJson] = await Promise.all([
          menusRes.json(),
          cateringRes.json(),
          standardsRes.json(),
          eventRes.json(),
        ]);
        setTabData({
          menus:             menusJson.data     || menusJson     || [],
          catering:          cateringJson.data  || cateringJson  || [],
          cateringStandards: standardsJson.data || standardsJson || [],
          eventTypes:        eventJson.data     || eventJson     || [],
        });
      } catch (e) {
        console.error('Tab fetch error', e);
      } finally {
        setLoadingTabs(false);
      }
    };
    fetchAllTabs();
  }, []);

  const handleAddToCart = () => {
    if (!product) return;
    const item = {
      id: product.id,
      menu_name: isKh
        ? (product.translations?.kh?.title || product.menu_name)
        : (product.translations?.en?.title || product.menu_name),
      price_usd: product.maxPrice || product.price_usd || 0,
      image: Array.isArray(product.images) ? product.images[0] : (product.image || product.images),
    };
    addToCart(item);
    setIsNotifyOpen(true);
  };

  const images = product
    ? (Array.isArray(product.images)
        ? product.images
        : [product.image || product.images]
      ).filter(Boolean)
    : [];

  const title = product
    ? (isKh
        ? (product.translations?.kh?.title || product.menu_name)
        : (product.translations?.en?.title || product.menu_name))
    : '';

  const price = product ? (product.maxPrice || product.price_usd || 0) : 0;
  const activeItems: any[] = tabData[activeTab as keyof TabData] || [];

  // =============================================
  // LOADING
  // =============================================
  if (loadingProduct) return (
    <div className={`min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center gap-4 ${isKh ? 'font-khmer' : 'font-sans'}`}>
      <div className="w-16 h-16 rounded-2xl bg-[#B48C00]/10 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#B48C00] animate-spin" />
      </div>
      <p className="font-black text-slate-400 text-sm uppercase tracking-widest">
        {isKh ? "កំពុងទាញទិន្នន័យ..." : "Loading..."}
      </p>
    </div>
  );

  if (!product) return (
    <div className={`min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center gap-4 ${isKh ? 'font-khmer' : 'font-sans'}`}>
      <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center">
        <Utensils size={28} className="text-rose-300" />
      </div>
      <p className="font-black text-slate-400 text-sm uppercase tracking-widest">
        {isKh ? "រកមិនឃើញម្ហូប" : "Product not found"}
      </p>
      <Link
        href={`/${lang}/food`}
        className="mt-2 flex items-center gap-2 text-sm font-black text-[#B48C00] hover:underline"
      >
        <ArrowLeft size={16} /> {isKh ? "ត្រឡប់ក្រោយ" : "Back to Menu"}
      </Link>
    </div>
  );

  // =============================================
  // RENDER
  // =============================================
  return (
    <div className={`min-h-screen bg-[#FAF7F2] ${isKh ? 'font-khmer' : 'font-sans'}`}>
      <CartNotification
        isOpen={isNotifyOpen}
        onClose={() => setIsNotifyOpen(false)}
        product={product}
        lang={lang}
        totalItems={totalItems}
      />
      <Header
        lang={lang}
        toggleLang={() => {}}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      {/* ---- BREADCRUMB ---- */}
      <div className="bg-[#5C1A0B]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-xs font-bold text-amber-200/50">
          <Link href={`/${lang}`} className="hover:text-amber-200 transition-colors">
            {isKh ? "ទំព័រដើម" : "Home"}
          </Link>
          <ChevronRight size={12} />
          <Link href={`/${lang}/food`} className="hover:text-amber-200 transition-colors">
            {isKh ? "ម្ហូប" : "Food"}
          </Link>
          <ChevronRight size={12} />
          <span className="text-amber-200/80 line-clamp-1">{title}</span>
        </div>
      </div>

      {/* ---- BACK BUTTON ---- */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-2">
        <Link
          href={`/${lang}/food`}
          className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-[#5C1A0B] transition-colors group"
        >
          <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center group-hover:border-[#5C1A0B]/30 transition-all">
            <ArrowLeft size={15} />
          </div>
          {isKh ? "ត្រឡប់ក្រោយ" : "Back to Menu"}
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16 space-y-6">

        {/* =============================================
            PRODUCT HERO CARD
        ============================================= */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* LEFT — Images */}
            <div className="bg-slate-50 p-6 flex flex-col gap-4 border-b lg:border-b-0 lg:border-r border-slate-100">

              {/* Main Image */}
              <div className="relative h-72 lg:h-[420px] rounded-2xl overflow-hidden bg-slate-100 group">
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[selectedImage]}
                      alt={title}
                      className="w-full h-full object-cover transition-all duration-500"
                    />
                    {/* Nav arrows if multiple images */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedImage(i => (i - 1 + images.length) % images.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                        >
                          <ChevronLeft size={18} className="text-slate-700" />
                        </button>
                        <button
                          onClick={() => setSelectedImage(i => (i + 1) % images.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                        >
                          <ChevronRight size={18} className="text-slate-700" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <ImageOff size={48} className="text-slate-200" />
                    <p className="text-slate-300 text-xs font-black uppercase tracking-widest">
                      {isKh ? "គ្មានរូបភាព" : "No Image"}
                    </p>
                  </div>
                )}

                {/* Price badge */}
                <div className="absolute top-4 right-4 bg-[#B48C00] px-4 py-2 rounded-full shadow-lg">
                  <span className="text-white font-black text-base">${Number(price).toFixed(2)}</span>
                </div>

                {/* Image counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm text-white text-[10px] font-black px-3 py-1 rounded-full">
                    {selectedImage + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {images.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === i
                          ? 'border-[#B48C00] shadow-md scale-105'
                          : 'border-transparent opacity-50 hover:opacity-90'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — Info */}
            <div className="p-8 flex flex-col gap-6">

              {/* Badge + Title */}
              <div>
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-[#B48C00] border border-amber-200 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                  <Tag size={11} /> {isKh ? "ម្ហូបពិសេស" : "Featured Dish"}
                </span>
                <h1 className="text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
                  {title}
                </h1>
                {product?.category_name && (
                  <p className="text-slate-400 text-sm font-bold mt-2 flex items-center gap-1.5">
                    <Utensils size={13} /> {product.category_name}
                  </p>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#B48C00]/10 flex items-center justify-center flex-shrink-0">
                    <Users size={18} className="text-[#B48C00]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {isKh ? "ចំនួនភ្ញៀវ" : "Guests"}
                    </p>
                    <p className="font-black text-slate-800 text-xl leading-none mt-1">
                      {product?.hallPrice || 0}
                      <span className="text-xs font-bold text-slate-400 ml-1">
                        {isKh ? "នាក់" : "pax"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <DollarSign size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {isKh ? "តម្លៃ" : "Price"}
                    </p>
                    <p className="font-black text-emerald-600 text-xl leading-none mt-1">
                      ${Number(price).toFixed(2)}
                    </p>
                  </div>
                </div>

                {product?.minPrice && product?.maxPrice && (
                  <div className="col-span-2 bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {isKh ? "ជួរតម្លៃ" : "Price Range"}
                    </p>
                    <p className="font-black text-[#B48C00] text-sm">
                      ${Number(product.minPrice).toFixed(2)}
                      <span className="text-slate-300 mx-2">—</span>
                      ${Number(product.maxPrice).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              {product?.description && (
                <div className="bg-slate-50 rounded-2xl p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                    <BookOpen size={11} />
                    {isKh ? "ការពិពណ៌នា" : "Description"}
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {isKh
                      ? (product.translations?.kh?.description || product.description)
                      : (product.translations?.en?.description || product.description)}
                  </p>
                </div>
              )}

              {/* Extra product fields */}
              <div className="space-y-2">
                {product?.tables_count && (
                  <div className="flex items-center justify-between text-sm py-2 border-b border-slate-50">
                    <span className="text-slate-400 font-bold flex items-center gap-2">
                      <CheckCircle size={14} className="text-[#B48C00]" />
                      {isKh ? "ចំនួនតុ" : "Tables"}
                    </span>
                    <span className="font-black text-slate-700">{product.tables_count}</span>
                  </div>
                )}
                {product?.duration && (
                  <div className="flex items-center justify-between text-sm py-2 border-b border-slate-50">
                    <span className="text-slate-400 font-bold flex items-center gap-2">
                      <Calendar size={14} className="text-[#B48C00]" />
                      {isKh ? "រយៈពេល" : "Duration"}
                    </span>
                    <span className="font-black text-slate-700">{product.duration}</span>
                  </div>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="mt-auto w-full py-4 bg-[#5C1A0B] hover:bg-[#7A2210] text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#5C1A0B]/20 active:scale-[0.98] text-sm uppercase tracking-widest"
              >
                <ShoppingCart size={18} />
                {isKh ? "បន្ថែមទៅកន្ត្រក" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        {/* =============================================
            TABS SECTION
        ============================================= */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Tab Header */}
          <div className="bg-[#5C1A0B] px-6 py-5">
            <p className="text-amber-200/60 text-[10px] font-black uppercase tracking-[0.25em] mb-1">
              {isKh ? "ព័ត៌មានបន្ថែម" : "More Information"}
            </p>
            <p className="text-white/70 text-sm font-medium">
              {isKh
                ? "ជ្រើសរើសប្រភេទព័ត៌មានដែលអ្នកចង់ដឹង"
                : "Select a category to explore more details"}
            </p>
          </div>

          {/* Tab Buttons */}
          <div className="border-b border-slate-100 px-4 pt-4">
            <div className="flex gap-1 overflow-x-auto pb-0 no-scrollbar">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const count = tabData[tab.key as keyof TabData]?.length || 0;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-5 py-3.5 font-black text-[11px] uppercase tracking-widest whitespace-nowrap transition-all border-b-2 -mb-px ${
                      isActive
                        ? 'border-[#B48C00] text-[#B48C00]'
                        : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label[isKh ? 'kh' : 'en']}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                      isActive
                        ? 'bg-[#B48C00] text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {loadingTabs ? (
              <div className="py-20 flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-[#B48C00] animate-spin" />
                <p className="text-slate-400 font-black text-xs uppercase tracking-widest">
                  {isKh ? "កំពុងទាញ..." : "Loading..."}
                </p>
              </div>
            ) : activeItems.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
                  <Utensils size={20} className="text-slate-200" />
                </div>
                <p className="text-slate-300 font-black text-sm uppercase tracking-widest">
                  {isKh ? "រកមិនឃើញទិន្នន័យ" : "No data found"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeItems.map((item: any, idx: number) => (
                  <TabCard
                    key={item.id || idx}
                    item={item}
                    tabKey={activeTab}
                    isKh={isKh}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer lang={'en'}/>
    </div>
  );
}