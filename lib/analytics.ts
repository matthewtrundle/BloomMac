// Analytics tracking system for real data collection
// Sends events to server-side API for persistent storage

export interface AnalyticsEvent {
  type: 'page_view' | 'contact_form' | 'booking_click' | 'exit_intent' | 'scroll_banner' | 'resource_download' | 'chatbot_interaction' | 'newsletter_signup' | 'new_mom_signup';
  page: string;
  sessionId?: string;
  userId?: string;
  data?: {
    source?: string;
    service?: string;
    action?: string;
    value?: string;
    referrer?: string;
  };
}

class AnalyticsManager {
  private sessionId: string;
  private userId: string | null = null;
  private source: string | null = null;

  constructor() {
    // Generate session ID when analytics manager is created
    this.sessionId = this.generateId();
    
    // Set source from URL parameters or referrer
    if (typeof window !== 'undefined') {
      this.initializeTracking();
    }
  }

  private initializeTracking() {
    // Get UTM parameters
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    
    // Determine traffic source
    if (utmSource) {
      this.source = utmSource;
    } else if (document.referrer) {
      try {
        const referrerUrl = new URL(document.referrer);
        const hostname = referrerUrl.hostname;
        
        if (hostname.includes('google')) this.source = 'google';
        else if (hostname.includes('facebook')) this.source = 'facebook';
        else if (hostname.includes('instagram')) this.source = 'instagram';
        else if (hostname.includes('linkedin')) this.source = 'linkedin';
        else if (hostname.includes('twitter')) this.source = 'twitter';
        else this.source = 'referral';
      } catch {
        this.source = 'direct';
      }
    } else {
      this.source = 'direct';
    }

    // Get or create user ID
    const storedUserId = localStorage.getItem('bloom_user_id');
    if (storedUserId) {
      this.userId = storedUserId;
    } else {
      this.userId = this.generateId();
      localStorage.setItem('bloom_user_id', this.userId);
    }
  }

  // Track events by sending to server
  async trackEvent(event: Omit<AnalyticsEvent, 'sessionId' | 'userId'>): Promise<void> {
    if (typeof window === 'undefined') return;

    const fullEvent: AnalyticsEvent = {
      ...event,
      sessionId: this.sessionId,
      userId: this.userId,
      data: {
        ...event.data,
        source: event.data?.source || this.source || 'direct',
        referrer: document.referrer || 'direct'
      }
    };

    try {
      // Send to server
      const response = await fetch('/api/track-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullEvent),
      });

      if (!response.ok) {
        console.error('Failed to track event:', response.statusText);
      } else {
        console.log('Event tracked:', event.type, event.page);
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }

    // Also send to GA4 if available
    if (window.gtag) {
      window.gtag('event', event.type, {
        event_category: 'engagement',
        event_label: event.page,
        value: event.data?.value,
        custom_parameter: event.data
      });
    }
  }

  // Specific tracking methods
  trackPageView(page: string) {
    this.trackEvent({
      type: 'page_view',
      page,
    });
  }

  trackContactForm(page: string, service?: string) {
    this.trackEvent({
      type: 'contact_form',
      page,
      data: { service }
    });
  }

  trackBookingClick(page: string, service?: string) {
    this.trackEvent({
      type: 'booking_click',
      page,
      data: { service }
    });
  }

  trackNewsletterSignup(page: string) {
    this.trackEvent({
      type: 'newsletter_signup',
      page,
    });
  }

  trackNewMomSignup(page: string) {
    this.trackEvent({
      type: 'new_mom_signup',
      page,
    });
  }

  trackChatbotInteraction(page: string, action: string) {
    this.trackEvent({
      type: 'chatbot_interaction',
      page,
      data: { action }
    });
  }

  trackResourceDownload(page: string, resource: string) {
    this.trackEvent({
      type: 'resource_download',
      page,
      data: { value: resource }
    });
  }

  trackExitIntent(page: string) {
    this.trackEvent({
      type: 'exit_intent',
      page,
    });
  }

  trackScrollBanner(page: string, action: string) {
    this.trackEvent({
      type: 'scroll_banner',
      page,
      data: { action }
    });
  }

  // Helper methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Get current session ID (useful for chat tracking)
  getSessionId(): string {
    return this.sessionId;
  }

  // Get user ID
  getUserId(): string | null {
    return this.userId;
  }
}

// Create singleton instance
export const analytics = new AnalyticsManager();

// Auto-track page views when this module is imported
if (typeof window !== 'undefined') {
  // Track initial page view
  setTimeout(() => {
    analytics.trackPageView(window.location.pathname);
  }, 100);

  // Track page views on route changes (for Next.js)
  if (window.history && window.history.pushState) {
    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args);
      setTimeout(() => {
        analytics.trackPageView(window.location.pathname);
      }, 100);
    };
  }
}

// Declare global gtag type
declare global {
  interface Window {
    gtag?: (command: string, action: string, params: object) => void;
  }
}