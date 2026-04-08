"use client";

import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface CartNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  lang: string;
  totalItems: number;
}

export default function CartNotification({ isOpen, onClose, product, lang, totalItems }: CartNotificationProps) {
  if (!isOpen || !product) return null;

  return (
    <>
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-black/30 z-[60] backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Side Modal */}
      <div className="fixed top-4 right-4 w-full max-w-sm bg-white rounded-3xl shadow-2xl z-[70] overflow-hidden animate-in slide-in-from-right duration-300">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-500" size={24} />
              <span className="font-bold text-lg text-black">Added to Bag</span>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Product Detail */}
          <div className="flex gap-4 mb-8">
            <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
              <img src={product.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-black text-lg line-clamp-1">{product.menu_name}</h3>
              <p className="text-gray-400 text-sm mt-1">Quantity: 1</p>
              <p className="font-black text-lg mt-1">${product.price_usd.toFixed(2)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href={`/${lang}/cart`} className="block">
              <button className="w-full py-4 border-2 border-gray-100 rounded-full font-bold text-black hover:border-black transition-all">
                View Bag ({totalItems})
              </button>
            </Link>
            <Link href={`/${lang}/booking`} className="block">
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}