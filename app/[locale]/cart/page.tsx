"use client";

import React, { use, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Minus, Plus, Trash2, ArrowLeft, ChevronRight } from 'lucide-react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { useCart } from '../context/CartContext';
import { messages, Language } from '../../i18n/messages';

export default function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const lang = resolvedParams.locale as Language;
  const t = messages[lang] || messages['kh'];
  
  const { cart, totalPrice, removeFromCart, updateTableCount, totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const EXCHANGE_RATE = 4100;
  const formatRiel = (usd: number) => (usd * EXCHANGE_RATE).toLocaleString() + " ៛";

  // មុខងារសម្រាប់បន្តទៅកាន់ទំព័រ Booking
  const handleProceedToBooking = () => {
    // រក្សាទុកទិន្នន័យចូល localStorage ដើម្បីឱ្យ Booking Page ទាញយកប្រើប្រាស់
    localStorage.setItem('cartData', JSON.stringify(cart));
    localStorage.setItem('cartTotal', totalPrice.toFixed(2));
    
    // ប្តូរទំព័រទៅកាន់ Booking
    window.location.href = `/${lang}/booking`;
  };

  const handleInputChange = (id: number, value: string) => {
    const num = value === "" ? 0 : parseInt(value);
    if (!isNaN(num) && num >= 0) updateTableCount(id, num);
  };

  return (
    <div className={`min-h-screen bg-[#F8F9FA] ${lang === 'kh' ? 'font-khmer' : 'font-sans'}`}>
      <Header lang={lang} toggleLang={() => {}} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        {/* ប៊ូតុងត្រឡប់ក្រោយ */}
        <Link href={`/${lang}/food`} className="inline-flex items-center gap-2 text-black hover:text-[#B48C00] font-black text-xs uppercase mb-8 transition-all">
          <ArrowLeft size={18} strokeWidth={3} /> {lang === 'kh' ? 'បន្តជ្រើសរើសមុខម្ហូប' : 'BACK TO MENU'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* បញ្ជីមុខម្ហូបក្នុងកន្ត្រក */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-black italic uppercase mb-8 border-b-4 border-[#B48C00] w-fit pb-1 text-black tracking-tighter">
              {lang === 'kh' ? 'បញ្ជីកក់របស់អ្នក' : 'YOUR BOOKING LIST'}
            </h1>
            
            {cart.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-gray-200 flex flex-col items-center">
                <ShoppingBag size={80} className="text-gray-100 mb-6" />
                <p className="text-black text-xl font-bold mb-8 italic">{lang === 'kh' ? 'មិនទាន់មានមុខម្ហូបក្នុងបញ្ជី' : 'Your bag is empty'}</p>
                <Link href={`/${lang}/food`} className="bg-[#B48C00] text-white px-10 py-4 rounded-full font-black uppercase shadow-lg hover:bg-black transition-all">
                  {lang === 'kh' ? 'ទៅមើលមុខម្ហូប' : 'Browse Menu'}
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item: any) => (
                  <div key={item.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-full md:w-44 h-32 flex-shrink-0 relative overflow-hidden rounded-2xl bg-gray-50">
                      <img src={item.image || '/default-food.jpg'} className="w-full h-full object-cover" alt={item.menu_name} />
                    </div>
                    <div className="flex-grow text-center md:text-left">
                      <h3 className="font-black text-xl text-black uppercase mb-1">{item.menu_name}</h3>
                      <div className="flex flex-col gap-1 mb-4">
                        <span className="text-[#B48C00] font-black text-xl">${item.price_usd.toFixed(2)}</span>
                        <span className="text-blue-600 font-bold text-xs">({formatRiel(item.price_usd)}) / table</span>
                      </div>
                      <div className="flex items-center justify-center md:justify-start">
                        <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200 shadow-inner">
                          <button onClick={() => updateTableCount(item.id, Math.max(0, item.tables - 1))} className="w-10 h-10 bg-white text-black rounded-lg shadow-sm flex items-center justify-center"><Minus size={18} /></button>
                          <input type="text" value={item.tables} onChange={(e) => handleInputChange(item.id, e.target.value)} className="w-10 h-10 bg-transparent text-center font-black text-2xl text-black focus:outline-none" />
                          <button onClick={() => updateTableCount(item.id, item.tables + 1)} className="w-10 h-10 bg-white text-black rounded-lg shadow-sm flex items-center justify-center"><Plus size={18} /></button>
                        </div>
                      </div>
                    </div>
                    <div className="text-right min-w-[180px] pt-4 md:pt-0 md:pl-8 flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto">
                        <p className="font-black text-3xl text-black leading-none">${(item.price_usd * item.tables).toFixed(2)}</p>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-600"><Trash2 size={24} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* សេចក្តីសង្ខេបនៃការបញ្ជាទិញ */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 sticky top-28">
              <h2 className="font-black text-2xl uppercase italic mb-8 text-center text-black">ORDER SUMMARY</h2>
              <div className="space-y-6 mb-10">
                <div className="flex justify-between font-bold text-gray-500 text-sm uppercase">
                  <span>{lang === 'kh' ? 'ចំនួនតុសរុប' : 'TOTAL TABLES'}</span>
                  <span className="text-black font-black text-xl">{totalItems} TBL</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-5xl font-black text-[#B48C00] italic leading-none tracking-tighter">${totalPrice.toFixed(2)}</span>
                  <span className="text-2xl font-black text-blue-600 mt-4 italic">{formatRiel(totalPrice)}</span>
                </div>
              </div>
              
              <button 
                onClick={handleProceedToBooking}
                disabled={cart.length === 0}
                className="w-full bg-black text-white py-5 rounded-2xl font-black text-xl uppercase hover:bg-[#B48C00] transition-all shadow-xl flex items-center justify-center gap-3 group disabled:bg-gray-300"
              >
                {lang === 'kh' ? 'កក់ឥឡូវនេះ' : 'BOOK NOW'} 
                <ChevronRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer lang={'en'} />
    </div>
  );
}