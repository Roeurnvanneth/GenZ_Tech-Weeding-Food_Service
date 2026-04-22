// src/app/[locale]/layout.tsx

import "../globals.css";
import { CartProvider } from './context/CartContext'; // Adjust path if needed
import Header from '../components/header';
import Footer from '../components/footer';
import { notFound } from "next/navigation";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await the params for Next.js 15+ compatibility
  const { locale } = await params;
  if(!locale || (locale !== 'en' && locale !== 'kh')) {
    notFound  (); // Handle invalid locale by showing 404
  }

  

  return (
    <html lang={locale}>
      <body className="antialiased">
        {/* 1. Wrap EVERYTHING in the Provider */}
        <CartProvider>
          
          {/* 2. Now the Header can "see" the totalItems */}
          <Header lang={locale as any} />
          <main>
            {children}
          </main>
          <Footer lang={locale as any} />
          
        </CartProvider>
      </body>
    </html>
  );
}