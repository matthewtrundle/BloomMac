'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ConsultLauncher from '@/components/layout/ConsultLauncher';
import ScrollConsultationBanner from '@/components/ui/ScrollConsultationBanner';
import LazyChatBot from '@/components/ui/LazyChatBot';
import HeatmapTracker from '@/components/HeatmapTracker';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  
  // Check if we're in the course learning interface
  const isCoursePage = pathname?.includes('/learn/');
  const isCourseLoginPage = pathname?.includes('/my-courses');
  
  // Create clean learning environment - no distractions
  const shouldShowMarketingElements = !isCoursePage;
  const shouldShowHeader = !isCoursePage; // Course pages have their own minimal navigation
  const shouldShowFooter = !isCoursePage;

  if (isCoursePage) {
    // Clean course interface - no header, footer, chatbot, or popups
    return (
      <>
        <main className="min-h-screen">
          {children}
        </main>
        {/* Only keep analytics for course completion tracking */}
        <HeatmapTracker />
      </>
    );
  }

  // Regular site layout with all marketing elements
  return (
    <>
      {shouldShowHeader && <Header />}
      <main className={shouldShowHeader ? "pt-20" : ""}>
        {children}
      </main>
      {shouldShowFooter && <Footer />}
      
      {/* Marketing elements only on non-course pages */}
      {shouldShowMarketingElements && (
        <>
          <ConsultLauncher />
          <ScrollConsultationBanner 
            enabled={true} 
            scrollThreshold={70} 
            delay={8000} 
          />
          <LazyChatBot />
        </>
      )}
      
      <HeatmapTracker />
    </>
  );
}