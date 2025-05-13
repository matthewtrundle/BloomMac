import React from 'react';
import { Inter, Playfair_Display, Poppins, Raleway } from 'next/font/google';
import Head from 'next/head';
import '@/app/globals.css';

// Initialize the fonts
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair'
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins'
});

const raleway = Raleway({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway'
});

interface AdPageLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export default function AdPageLayout({ children, title, description }: AdPageLayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      
      <div className={`${inter.variable} ${playfair.variable} ${poppins.variable} ${raleway.variable} min-h-screen bg-white text-bloom`}>
        {children}
      </div>
    </>
  );
}
