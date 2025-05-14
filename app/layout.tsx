import type { Metadata } from 'next';
import { Inter, Playfair_Display, Poppins, Raleway } from 'next/font/google';
import './globals.css';

// Import layout components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ConsultLauncher from '@/components/layout/ConsultLauncher';

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

export const metadata: Metadata = {
  title: {
    template: '%s | Bloom Psychology North Austin',
    default: 'Bloom Psychology North Austin | Women\'s Mental Health'
  },
  description: 'Bloom Psychology North Austin offers specialized therapy for women, moms, and parents. Evidence-based support for anxiety, stress, postpartum depression, and more.',
  keywords: 'therapy, psychologist, mental health, women\'s therapy, mom therapy, parent support, anxiety, Austin, telehealth, postpartum depression',
  openGraph: {
    title: 'Bloom Psychology North Austin',
    description: 'Specialized therapy for women, moms, and parents in North Austin.',
    images: ['/images/Logo/logo.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${poppins.variable} ${raleway.variable}`}>
      <body className="bg-white text-bloom min-h-screen">
        <Header />
        <main className="pt-24">
          {children}
        </main>
        <Footer />
        <ConsultLauncher />
      </body>
    </html>
  );
}
