import type { Metadata } from 'next';
import { Inter, Playfair_Display, Poppins, Raleway, Bebas_Neue, Montserrat, Cormorant_Garamond, Space_Grotesk, DM_Serif_Display } from 'next/font/google';
import './globals.css';

// Import layout components
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import { AnalyticsProvider } from '@/components/AnalyticsProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import LoadingScreenProvider from '@/components/ui/LoadingScreenProvider';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import AuthDebug from '@/components/auth/AuthDebug';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  adjustFontFallback: true
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  preload: true,
  adjustFontFallback: true
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  preload: true,
  adjustFontFallback: true
});

const raleway = Raleway({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
  preload: true,
  adjustFontFallback: true
});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bebas',
  preload: true,
  adjustFontFallback: true
});

const montserrat = Montserrat({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  preload: true,
  adjustFontFallback: true
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
  preload: true,
  adjustFontFallback: true
});

const spaceGrotesk = Space_Grotesk({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space',
  preload: true,
  adjustFontFallback: true
});

const dmSerifDisplay = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-serif',
  preload: true,
  adjustFontFallback: true
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.bloompsychologynorthaustin.com'),
  title: {
    template: '%s | Bloom Psychology',
    default: 'Bloom Psychology | Women\'s Mental Health'
  },
  description: 'Mental health care for real life transitions. Dr. Jana Rundle provides expert, compassionate therapy for women and moms—in Austin and across Texas, in-person or virtual.',
  keywords: 'therapy, psychologist, mental health, women\'s therapy, mom therapy, parent support, anxiety, Austin, telehealth, postpartum depression',
  openGraph: {
    title: 'Bloom Psychology',
    description: 'Mental health care for real life transitions. Dr. Jana Rundle provides expert, compassionate therapy for women and moms—in Austin and across Texas, in-person or virtual.',
    images: ['/images/Logo/logo.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Root layout for Bloom Psychology
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${poppins.variable} ${raleway.variable} ${bebasNeue.variable} ${montserrat.variable} ${cormorantGaramond.variable} ${spaceGrotesk.variable} ${dmSerifDisplay.variable}`}>
      <head>
        {/* Mobile viewport - CRITICAL for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Favicon - Multiple sizes and formats */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Resource hints for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://calendly.com" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/images/optimized/Hero/herooptimzed.webp" as="image" fetchPriority="high" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://calendly.com" />
        <link rel="dns-prefetch" href="https://assets.calendly.com" />
        <link rel="dns-prefetch" href="https://cdn.calendly.com" />
        
        {/* Google Analytics */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
      </head>
      <body 
        className="bg-white text-bloom min-h-screen"
        suppressHydrationWarning
      >
        <LoadingScreenProvider>
          <AuthProvider>
            <AnalyticsProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
              <DarkModeToggle />
              {process.env.NODE_ENV === 'development' && <AuthDebug />}
            </AnalyticsProvider>
          </AuthProvider>
        </LoadingScreenProvider>
      </body>
    </html>
  );
}
