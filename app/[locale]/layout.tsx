import "../globals.css";

// Add 'async' here
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Change to Promise
}) {
  // Add 'await' here
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body className="antialiased" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}