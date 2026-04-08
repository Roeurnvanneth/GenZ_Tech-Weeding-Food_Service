"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);

  // ទាញទិន្នន័យពី LocalStorage ពេលបើក App
  useEffect(() => {
    const savedCart = localStorage.getItem('app_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("កំហុសក្នុងការទាញទិន្នន័យ", e);
      }
    }
  }, []);

  // រក្សាទុកក្នុង LocalStorage ពេលមានការផ្លាស់ប្តូរ
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
      return [...prev, { ...product, tables: 1 }];
    });
  };

  const updateTableCount = (id: number, count: number) => {
    setCart((prev) => 
      prev.map((item) => 
        item.id === id ? { ...item, tables: Math.max(1, count) } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter(item => item.id !== id));
  };

  const totalTables = cart.reduce((sum, item) => sum + item.tables, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price_usd * item.tables), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateTableCount, 
      totalItems: totalTables, 
      totalPrice 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);