"use client";
 
import React, { use, useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { useCart } from "../context/CartContext";
import { Language } from "../../i18n/messages";
 
export default function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = use(params);
  const lang = resolvedParams.locale as Language;
 
  const { cart, removeFromCart, updateTableCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 
  const EXCHANGE_RATE = 4100;
  const formatRiel = (usd: number) =>
    (usd * EXCHANGE_RATE).toLocaleString() + " ៛";
 
  // ====================================================
  // ការគណនា: ម្ហូបសរុប + Hall Fee (តម្លៃខ្ពស់បំផុតពី Cart)
  // ====================================================
  const subtotalFood = cart.reduce(
    (acc: number, item: any) =>
      acc + Number(item.price_usd || 0) * (item.tables || 1),
    0
  );
 
  // យក hallPrice ខ្ពស់បំផុតពី items ទាំងអស់ក្នុង Cart
  const hallPrices = cart.map((item: any) => Number(item.hallPrice || 0));
  const HALL_FEE = hallPrices.length > 0 ? Math.max(...hallPrices) : 0;
 
  const grandTotal = subtotalFood + HALL_FEE;
 
  const handleProceedToBooking = () => {
    localStorage.setItem("cartData", JSON.stringify(cart));
    localStorage.setItem("cartTotal", grandTotal.toFixed(2));
    window.location.href = `/${lang}/booking`;
  };
 
  return (
    <div
      className={`min-h-screen bg-[#F8F9FA] ${lang === "kh" ? "font-khmer" : "font-sans"}`}
    >
      <Header
        lang={lang}
        toggleLang={() => {}}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
 
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        {/* Back Button */}
        <Link
          href={`/${lang}/food`}
          className="inline-flex items-center gap-2 text-black hover:text-[#B48C00] font-black text-xs uppercase mb-8"
        >
          <ArrowLeft size={18} strokeWidth={3} />
          {lang === "kh" ? "បន្តជ្រើសរើសមុខម្ហូប" : "BACK TO MENU"}
        </Link>
 
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ====== Left: Cart Items ====== */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-black italic uppercase mb-8 border-b-4 border-[#B48C00] w-fit pb-1 text-black">
              {lang === "kh" ? "បញ្ជីកក់របស់អ្នក" : "YOUR BOOKING LIST"}
            </h1>
 
            {cart.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-gray-200">
                <p className="text-black text-xl font-bold italic">
                  {lang === "kh" ? "កន្ត្រកទទេ" : "Your bag is empty"}
                </p>
                <Link
                  href={`/${lang}/food`}
                  className="inline-block mt-6 px-8 py-3 bg-black text-white rounded-2xl font-black text-xs uppercase hover:bg-[#B48C00] transition-all"
                >
                  {lang === "kh" ? "ជ្រើសរើសម្ហូប" : "Browse Menu"}
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item: any) => {
                  // ទាញ hallPrice ពី item ដោយផ្ទាល់
                  const itemHallPrice = Number(item.hallPrice || 0);
                  const itemFoodPrice = Number(item.price_usd || 0);
                  const tables = item.tables || 1;
 
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6"
                    >
                      {/* Product Image */}
                      <img
                        src={item.image}
                        className="w-44 h-32 rounded-2xl object-cover bg-gray-50 flex-shrink-0"
                        alt={item.menu_name}
                      />
 
                      <div className="flex-grow w-full">
                        <h3 className="font-black text-xl text-black uppercase mb-3">
                          {item.menu_name}
                        </h3>
 
                        {/* Food Price Badge + Hall Price Badge */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold">
                            {lang === "kh" ? "តម្លៃម្ហូប" : "Food"}:
                            ${itemFoodPrice.toFixed(2)}
                          </div>
                          <div className="bg-amber-50 text-[#B48C00] px-3 py-1 rounded-lg text-xs font-bold">
                            {lang === "kh" ? "តម្លៃរោង" : "Hall"}:
                            {/* ✅ បង្ហាញ hallPrice ពិតប្រាកដ ឬ $0.00 */}
                            +${itemHallPrice.toFixed(2)}
                          </div>
                        </div>
 
                        {/* Table Count Controls */}
                        <div className="flex items-center bg-gray-200 w-fit p-1 rounded-xl gap-1">
                          <button
                            onClick={() =>
                              updateTableCount(item.id, Math.max(1, tables - 1))
                            }
                            className="w-10 h-10 bg-black text-white rounded-lg shadow-sm flex items-center justify-center hover:bg-[#B48C00] transition-all"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-12 text-center font-black text-black text-2xl">
                            {tables}
                          </span>
                          <button
                            onClick={() =>
                              updateTableCount(item.id, tables + 1)
                            }
                            className="w-10 h-10 bg-black text-white rounded-lg shadow-sm flex items-center justify-center hover:bg-[#B48C00] transition-all"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
 
                      {/* Right: Total + Remove */}
                      <div className="text-right flex-shrink-0">
                        <p className="font-black text-3xl text-black">
                          ${(itemFoodPrice * tables).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {tables} {lang === "kh" ? "តុ" : "table(s)"}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-600 mt-3 transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
 
          {/* ====== Right: Order Summary ====== */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl sticky top-28 border-t-4 border-[#B48C00]">
              <h2 className="font-black text-xl mb-6 uppercase text-black">
                {lang === "kh" ? "សរុបការកក់" : "Order Summary"}
              </h2>
 
              <div className="space-y-4 mb-8">
                {/* Food Subtotal */}
                <div className="flex justify-between text-gray-500">
                  <span className="text-sm">
                    {lang === "kh" ? "តម្លៃម្ហូបសរុប" : "Food Subtotal"}:
                  </span>
                  <span className="font-bold text-black">
                    ${subtotalFood.toFixed(2)}
                  </span>
                </div>
 
                {/* Hall & Decor Fee */}
                <div className="flex justify-between text-[#B48C00]">
                  <span className="text-sm">
                    {lang === "kh" ? "តម្លៃរោង/តុបតែង" : "Hall & Decor"}:
                  </span>
                  {/* ✅ បង្ហាញ HALL_FEE ពិតប្រាកដ */}
                  <span className="font-bold">+${HALL_FEE.toFixed(2)}</span>
                </div>
 
                {/* Divider */}
                <div className="border-t border-dashed border-gray-200 pt-4">
                  <div className="flex justify-between items-start">
                    <span className="font-black text-black text-lg">
                      {lang === "kh" ? "សរុប" : "Total"}:
                    </span>
                    <div className="text-right">
                      <span className="block font-black text-[#B48C00] text-3xl">
                        ${grandTotal.toFixed(2)}
                      </span>
                      <span className="text-blue-600 text-sm font-bold">
                        {formatRiel(grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
 
              {/* Book Now Button */}
              <button
                onClick={handleProceedToBooking}
                disabled={cart.length === 0}
                className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase hover:bg-[#B48C00] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {lang === "kh" ? "កក់ឥឡូវនេះ" : "BOOK NOW"}
              </button>
 
              {/* Item count info */}
              {cart.length > 0 && (
                <p className="text-center text-gray-400 text-xs font-bold mt-4 uppercase">
                  {cart.length} {lang === "kh" ? "មុខម្ហូប" : "menu item(s)"}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
 
      <Footer lang={"en"} />
    </div>
  );
}