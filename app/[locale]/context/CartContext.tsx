"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('app_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error loading cart:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('app_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const isExist = prev.find((item) => item.id === product.id);
      if (isExist) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, tables: item.tables + 1 } : item
        );
      }
      return [...prev, { 
        ...product, 
        tables: 1, 
        price_usd: Number(product.price_usd || 0),
        hallPrice: Number(product.hallPrice || 0) 
      }];
    });
  };

  const updateTableCount = (id: number, count: number) => {
    setCart((prev) => 
      prev.map((item) => item.id === id ? { ...item, tables: Math.max(1, count) } : item)
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter(item => item.id !== id));
  };

  const totalPrice = cart.reduce((sum, item) => {
    return sum + (Number(item.price_usd || 0) * item.tables) + Number(item.hallPrice || 0);
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateTableCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);