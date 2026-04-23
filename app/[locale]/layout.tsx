import "../globals.css";
import { CartProvider } from "./context/CartContext"; // Adjust path if needed
import Header from "../components/header";
import Footer from "../components/footer";

// app/[locale]/layout.tsx

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
      <Header lang={locale as any} />
      <main>{children}</main>
      <Footer lang={locale as any} />
    </CartProvider>
  );
}
