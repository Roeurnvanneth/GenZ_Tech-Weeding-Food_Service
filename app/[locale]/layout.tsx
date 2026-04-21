import { CartProvider } from '../[locale]/context/CartContext';
import { Toaster } from 'react-hot-toast';

// 1. RootLayout ត្រូវតែជា Server Component (មិនអាចជា 'use client' ទេ)
// 2. ការប្រើ params ក្នុង Layout គឺត្រូវតាមស្តង់ដារថ្មីរបស់ Next.js 15+
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body className="antialiased">
        {/* CartProvider គឺជា Client Component ដូច្នេះវានឹងមិនប៉ះពាល់ដល់ RootLayout */}
        <CartProvider>
          {children}
          <Toaster position="top-right" />
        </CartProvider>  
      </body>
    </html>
    
  );
}