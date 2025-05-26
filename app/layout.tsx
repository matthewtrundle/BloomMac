import type { Metadata } from 'next';
import { Inter, Playfair_Display, Poppins, Raleway } from 'next/font/google';
import './globals.css';

// Import layout components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ConsultLauncher from '@/components/layout/ConsultLauncher';

// Import engagement components
import ScrollConsultationBanner from '@/components/ui/ScrollConsultationBanner';
import ChatBot from '@/components/ui/ChatBot';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  preload: true
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  preload: true
});

const raleway = Raleway({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
  preload: true
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.bloompsychologynorthaustin.com'),
  title: {
    template: '%s | Bloom Psychology',
    default: 'Bloom Psychology | Women\'s Mental Health'
  },
  description: 'Bloom Psychology offers specialized therapy for women, moms, and parents. Evidence-based support for anxiety, stress, postpartum depression, and more.',
  keywords: 'therapy, psychologist, mental health, women\'s therapy, mom therapy, parent support, anxiety, Austin, telehealth, postpartum depression',
  openGraph: {
    title: 'Bloom Psychology',
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
      <head>
        {/* Favicon - Multiple sizes and formats */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Resource hints for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://calendly.com" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/images/Hero/herooptimzed.png" as="image" fetchPriority="high" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://calendly.com" />
        <link rel="dns-prefetch" href="https://assets.calendly.com" />
        <link rel="dns-prefetch" href="https://cdn.calendly.com" />
      </head>
      <body className="bg-white text-bloom min-h-screen">
        <Header />
        <main className="pt-20">
          {children}
        </main>
        <Footer />
        <ConsultLauncher />
        <ScrollConsultationBanner enabled={true} scrollThreshold={70} delay={8000} />
        <ChatBot enabled={true} />
      </body>
    </html>
  );
}
