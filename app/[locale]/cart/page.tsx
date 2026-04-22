"use client";

import React, { use, useState } from 'react'; 
import Link from 'next/link';
import Header from '../../components/header'; 
import Footer from '../../components/footer'; 
import { useCart } from '../context/CartContext'; 
import { messages, Language } from '../../i18n/messages';
import { Trash2, ShoppingBag, Minus, Plus, ChevronRight, ArrowLeft } from 'lucide-react';

export default function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  // 1. Extract the locale from the URL params using 'use'
        const { locale } = use(params);
        
        // 2. Cast the locale to your Language type ('en' or 'kh')
        const lang = (locale === 'en' || locale === 'kh' ? locale : 'en') as Language;
        
        // 3. Get the correct translations
        const t = messages[lang];
  
  // ទាញយកទិន្នន័យពី CartContext
  const { cart, totalPrice, removeFromCart, updateTableCount, totalItems } = useCart();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // អត្រាប្តូរប្រាក់ (១ ដុល្លារ = ៤១០០ រៀល)
  const EXCHANGE_RATE = 4100;

  const formatRiel = (usd: number) => {
    return (usd * EXCHANGE_RATE).toLocaleString() + " ៛";
  };

  // មុខងារសម្រាប់វាយលេខតុដោយផ្ទាល់តាម Product ID
  const handleInputChange = (id: number, value: string) => {
    const num = value === "" ? 0 : parseInt(value);
    if (!isNaN(num) && num >= 0) {
      updateTableCount(id, num);
    }
  };

  return (
    <div className={`min-h-screen bg-[#F8F9FA] ${lang === 'kh' ? 'font-khmer' : 'font-sans'}`}>
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        {/* ប៊ូតុងត្រឡប់ក្រោយ */}
        <Link href={`/${lang}/food`} className="inline-flex items-center gap-2 text-black hover:text-[#B48C00] font-black text-xs uppercase mb-8 transition-all">
          <ArrowLeft size={18} strokeWidth={3} /> {lang === 'kh' ? 'បន្តជ្រើសរើសមុខម្ហូប' : 'BACK TO MENU'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* ផ្នែកខាងឆ្វេង៖ បញ្ជីមុខម្ហូបនីមួយៗ (Product Columns) */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-black italic uppercase mb-8 border-b-4 border-[#B48C00] w-fit pb-1 text-black tracking-tighter">
              {t.ybl}
            </h1>
            
            {cart.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-gray-200 flex flex-col items-center">
                <ShoppingBag size={80} className="text-gray-100 mb-6" />
                <p className="text-black text-xl font-bold mb-8 italic">{lang === 'kh' ? 'មិនទាន់មានមុខម្ហូបក្នុងបញ្ជី' : 'Your bag is empty'}</p>
                <Link href={`/${lang}/food`} className="bg-[#B48C00] text-white px-10 py-4 rounded-full font-black uppercase shadow-lg hover:bg-black transition-all">
                  {t.bm}
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item: any) => (
                  <div key={item.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 hover:border-[#B48C00]/30 transition-all">
                    
                    {/* photo product */}
                    <div className="w-full md:w-44 h-32 flex-shrink-0 relative overflow-hidden rounded-2xl bg-gray-50">
                      <img src={item.image} className="w-full h-full object-cover" alt="" />
                    </div>

                    {/* ការគ្រប់គ្រងចំនួនតុសម្រាប់មុខម្ហូបនីមួយៗ */}
                    <div className="flex-grow text-center md:text-left">
                      <h3 className="font-black text-xl text-black uppercase mb-1">{item.menu_name}</h3>
                      <div className="flex flex-col gap-1 mb-4">
                        <span className="text-[#B48C00] font-black text-xl">${item.price_usd.toFixed(2)}</span>
                        <span className="text-blue-600 font-bold text-xs">({formatRiel(item.price_usd)}) / table</span>
                      </div>
                      
                      {/* ចំនួនតុដាច់ដោយឡែកពីគ្នា */}
                      <div className="flex items-center justify-center md:justify-start">
                        <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200 shadow-inner">
                          <button 
                            onClick={() => updateTableCount(item.id, Math.max(0, item.tables - 1))} 
                            className="w-10 h-10 bg-white text-black rounded-lg shadow-sm active:scale-90 flex items-center justify-center hover:bg-gray-100 transition-all"
                          >
                            <Minus size={18} strokeWidth={3} />
                          </button>

                          <div className="flex items-center px-4">
                            <input 
                              type="text"
                              value={item.tables}
                              onChange={(e) => handleInputChange(item.id, e.target.value)}
                              className="w-10 h-10 bg-transparent text-center font-black text-2xl text-black focus:outline-none"
                            />
                            <span className="font-black text-black text-[10px] ml-1 uppercase tracking-tighter">TBL</span>
                          </div>

                          <button 
                            onClick={() => updateTableCount(item.id, item.tables + 1)} 
                            className="w-10 h-10 bg-white text-black rounded-lg shadow-sm active:scale-90 flex items-center justify-center hover:bg-gray-100 transition-all"
                          >
                            <Plus size={18} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* តម្លៃសរុបប្រចាំ Product (Subtotal) */}
                    <div className="text-right min-w-[180px] border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8 flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto">
                        <div className="text-left md:text-right">
                          <p className="text-[10px] text-gray-400 font-black uppercase mb-1">SUBTOTAL</p>
                          <p className="font-black text-3xl text-black leading-none">${(item.price_usd * item.tables).toFixed(2)}</p>
                          <p className="font-black text-[#B48C00] text-sm mt-2">{formatRiel(item.price_usd * item.tables)}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)} 
                          className="text-gray-300 hover:text-red-600 p-2 transition-all"
                        >
                          <Trash2 size={24} />
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ផ្នែកខាងស្តាំ៖ ORDER SUMMARY សរុបចំនួនតុ និងតម្លៃរួម */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 sticky top-28">
              <h2 className="font-black text-2xl uppercase italic mb-8 border-b-2 border-gray-50 pb-4 text-center text-black">
                {lang === 'kh' ? 'សេចក្តីសង្ខេប' : 'ORDER SUMMARY'}
              </h2>
              
              <div className="space-y-6 mb-10">
                {/* បង្ហាញចំនួនតុសរុបពីគ្រប់ Product */}
                <div className="flex justify-between font-bold text-gray-500 text-sm uppercase">
                  <span>{lang === 'kh' ? 'ចំនួនតុសរុប' : 'TOTAL TABLES'}</span>
                  <span className="text-black font-black text-xl">{totalItems} {lang === 'kh' ? 'តុ' : 'TBL'}</span>
                </div>
                
                <div className="h-[2px] bg-gray-50 my-4"></div>
                
                <div className="flex flex-col items-end">
                  <span className="font-black text-[10px] uppercase text-gray-400 italic mb-2">GRAND TOTAL</span>
                  <span className="text-5xl font-black text-[#B48C00] italic leading-none tracking-tighter">
                    ${totalPrice.toFixed(2)}
                  </span>
                  <span className="text-2xl font-black text-blue-600 mt-4 italic">
                    {formatRiel(totalPrice)}
                  </span>
                </div>
              </div>

              {/* ប៊ូតុងឆ្ពោះទៅការកក់ */}
              <Link href={`/${lang}/booking`}>
                <button className="w-full bg-black text-white py-5 rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-[#B48C00] transition-all shadow-xl flex items-center justify-center gap-3 group">
                  {lang === 'kh' ? 'កក់ឥឡូវនេះ' : 'BOOK NOW'} 
                  <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
              
              {/* បង្ហាញអត្រាប្តូរប្រាក់ */}
              <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col items-center">
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Current Exchange Rate</p>
                 <div className="flex items-center gap-2 px-4 py-1 bg-gray-50 rounded-full border border-gray-100">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-black italic">$1.00 = 4,100៛</span>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}