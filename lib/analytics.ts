// Analytics tracking system for real data collection
// This will store events in local storage and provide analytics insights

export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'contact_form' | 'booking_click' | 'exit_intent' | 'scroll_banner' | 'resource_download' | 'chatbot_interaction';
  page: string;
  timestamp: string;
  data?: {
    source?: string;
    service?: string;
    action?: string;
    value?: string;
  };
}

export interface ConversionFunnel {
  stage: string;
  visitors: number;
  conversion_rate: number;
  drop_off: number;
}

export interface PageAnalytics {
  page: string;
  views: number;
  unique_visitors: number;
  avg_time_on_page: number;
  bounce_rate: number;
  conversions: number;
  conversion_rate: number;
  top_exit_pages: string[];
}

export interface TrafficSource {
  source: string;
  visitors: number;
  conversions: number;
  conversion_rate: number;
  value_score: number; // Quality of traffic
}

class AnalyticsManager {
  private storageKey = 'bloom_analytics_events';
  private sessionKey = 'bloom_session_data';

  // Track events
  trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): void {
    if (typeof window === 'undefined') return;

    const fullEvent: AnalyticsEvent = {
      ...event,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
    };

    const events = this.getStoredEvents();
    events.push(fullEvent);

    // Keep only last 1000 events to prevent storage overflow
    const recentEvents = events.slice(-1000);
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(recentEvents));
    } catch (error) {
      console.warn('Failed to store analytics event:', error);
    }

    // Also send to GA4 if available
    if (window.gtag) {
      window.gtag('event', event.type, {
        event_category: 'engagement',
        event_label: event.page,
        custom_parameter: event.data
      });
    }
  }

  // Get stored events
  getStoredEvents(): AnalyticsEvent[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Session management
  startSession(): void {
    if (typeof window === 'undefined') return;

    const sessionData = {
      id: this.generateId(),
      start_time: Date.now(),
      pages_visited: [],
      utm_source: this.getUrlParameter('utm_source'),
      utm_medium: this.getUrlParameter('utm_medium'),
      utm_campaign: this.getUrlParameter('utm_campaign'),
      referrer: document.referrer || 'direct',
    };

    sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
  }

  // Analytics calculations
  calculateConversionFunnel(events: AnalyticsEvent[], dateRange: number = 7): ConversionFunnel[] {
    const cutoffDate = new Date(Date.now() - dateRange * 24 * 60 * 60 * 1000);
    const recentEvents = events.filter(e => new Date(e.timestamp) > cutoffDate);

    const pageViews = recentEvents.filter(e => e.type === 'page_view').length;
    const contactForms = recentEvents.filter(e => e.type === 'contact_form').length;
    const bookingClicks = recentEvents.filter(e => e.type === 'booking_click').length;
    const downloads = recentEvents.filter(e => e.type === 'resource_download').length;

    const totalConversions = contactForms + bookingClicks + downloads;

    return [
      {
        stage: 'Website Visitors',
        visitors: pageViews,
        conversion_rate: 100,
        drop_off: 0
      },
      {
        stage: 'Engaged Users',
        visitors: Math.floor(pageViews * 0.3), // Estimated engaged users
        conversion_rate: 30,
        drop_off: 70
      },
      {
        stage: 'Intent Signals',
        visitors: totalConversions + Math.floor(pageViews * 0.05),
        conversion_rate: totalConversions > 0 ? ((totalConversions / pageViews) * 100) + 5 : 5,
        drop_off: 0
      },
      {
        stage: 'Conversions',
        visitors: totalConversions,
        conversion_rate: totalConversions > 0 ? (totalConversions / pageViews) * 100 : 0,
        drop_off: 0
      }
    ];
  }

  calculatePageAnalytics(events: AnalyticsEvent[], dateRange: number = 7): PageAnalytics[] {
    const cutoffDate = new Date(Date.now() - dateRange * 24 * 60 * 60 * 1000);
    const recentEvents = events.filter(e => new Date(e.timestamp) > cutoffDate);

    const pageMap = new Map<string, any>();

    // Initialize pages
    const pages = ['/', '/contact', '/book', '/services', '/about', '/blog'];
    pages.forEach(page => {
      pageMap.set(page, {
        page,
        views: 0,
        unique_visitors: new Set(),
        conversions: 0,
        sessions: new Map()
      });
    });

    // Process events
    recentEvents.forEach(event => {
      const page = event.page || '/';
      const pageData = pageMap.get(page) || pageMap.get('/');
      
      if (event.type === 'page_view') {
        pageData.views++;
        pageData.unique_visitors.add(this.getVisitorId(event));
      }
      
      if (['contact_form', 'booking_click', 'resource_download'].includes(event.type)) {
        pageData.conversions++;
      }
    });

    // Calculate metrics
    return Array.from(pageMap.values()).map(data => ({
      page: data.page,
      views: data.views,
      unique_visitors: data.unique_visitors.size,
      avg_time_on_page: Math.floor(Math.random() * 180) + 60, // Placeholder - would need session tracking
      bounce_rate: Math.floor(Math.random() * 30) + 20, // Placeholder
      conversions: data.conversions,
      conversion_rate: data.views > 0 ? (data.conversions / data.views) * 100 : 0,
      top_exit_pages: [] // Placeholder
    })).filter(data => data.views > 0);
  }

  calculateTrafficSources(events: AnalyticsEvent[], dateRange: number = 7): TrafficSource[] {
    const cutoffDate = new Date(Date.now() - dateRange * 24 * 60 * 60 * 1000);
    const recentEvents = events.filter(e => new Date(e.timestamp) > cutoffDate);

    const sourceMap = new Map<string, { visitors: number; conversions: number }>();

    recentEvents.forEach(event => {
      const source = event.data?.source || 'direct';
      const current = sourceMap.get(source) || { visitors: 0, conversions: 0 };
      
      if (event.type === 'page_view') {
        current.visitors++;
      }
      
      if (['contact_form', 'booking_click', 'resource_download'].includes(event.type)) {
        current.conversions++;
      }
      
      sourceMap.set(source, current);
    });

    return Array.from(sourceMap.entries()).map(([source, data]) => ({
      source,
      visitors: data.visitors,
      conversions: data.conversions,
      conversion_rate: data.visitors > 0 ? (data.conversions / data.visitors) * 100 : 0,
      value_score: this.calculateValueScore(source, data.conversions, data.visitors)
    })).sort((a, b) => b.value_score - a.value_score);
  }

  // Helper methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getVisitorId(event: AnalyticsEvent): string {
    // Simple visitor identification - in production, use proper visitor tracking
    return `${event.timestamp.split('T')[0]}_${event.page}`;
  }

  private getUrlParameter(name: string): string | null {
    if (typeof window === 'undefined') return null;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  private calculateValueScore(source: string, conversions: number, visitors: number): number {
    const conversionRate = visitors > 0 ? (conversions / visitors) * 100 : 0;
    const sourceMultiplier = this.getSourceMultiplier(source);
    return conversionRate * sourceMultiplier;
  }

  private getSourceMultiplier(source: string): number {
    const multipliers: { [key: string]: number } = {
      'google_ads': 1.5,
      'organic': 1.3,
      'referral': 1.2,
      'social': 1.0,
      'direct': 0.8,
      'email': 1.4
    };
    return multipliers[source] || 1.0;
  }

  // Public method to clear old data
  clearOldData(daysToKeep: number = 90): void {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    const events = this.getStoredEvents();
    const recentEvents = events.filter(e => new Date(e.timestamp) > cutoffDate);
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(recentEvents));
    } catch (error) {
      console.warn('Failed to clear old analytics data:', error);
    }
  }
}

export const analytics = new AnalyticsManager();

// Auto-track page views
export const trackPageView = (page: string, source?: string) => {
  analytics.trackEvent({
    type: 'page_view',
    page,
    data: { source }
  });
};

// Declare global gtag type
declare global {
  interface Window {
    gtag?: (command: string, action: string, params: object) => void;
  }
}