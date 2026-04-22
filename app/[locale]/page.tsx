"use client";

// Import 'use' here
import React, { use } from 'react'; 
import HomePageContent from "./home/page"; 

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  // Now 'use' will work to unwrap the params promise
  const { locale } = use(params);

  return (
    <main>
      <HomePageContent lang={locale} />
    </main>
  );
}