// import "./globals.css";
import { CartProvider } from "../context/CartContext"; // Adjust path if needed


export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // No <html> or <body> here!
  return (
    <CartProvider>
      <main>{children}</main>
    </CartProvider>
  );
}