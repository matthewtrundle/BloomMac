// Analytics tracking library
import { supabase } from './supabase';

// Generate or retrieve session ID
const getSessionId = (): string => {
  const key = 'bloom_session_id';
  let sessionId = sessionStorage.getItem(key);
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(key, sessionId);
  }
  
  return sessionId;
};

// Get traffic source
const getTrafficSource = (): string => {
  const referrer = document.referrer;
  const urlParams = new URLSearchParams(window.location.search);
  
  // Check UTM parameters first
  if (urlParams.get('utm_source')) {
    return urlParams.get('utm_source') || 'unknown';
  }
  
  // Check referrer
  if (!referrer || referrer.includes(window.location.hostname)) {
    return 'direct';
  }
  
  if (referrer.includes('google')) return 'google';
  if (referrer.includes('facebook')) return 'facebook';
  if (referrer.includes('instagram')) return 'instagram';
  if (referrer.includes('linkedin')) return 'linkedin';
  
  return 'referral';
};

// Track event
export const trackEvent = async (
  type: string,
  data: Record<string, any> = {}
) => {
  try {
    const sessionId = getSessionId();
    const source = getTrafficSource();
    
    const eventData = {
      type,
      page: window.location.pathname,
      session_id: sessionId,
      data: {
        ...data,
        source,
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }
    };
    
    // Send to Supabase
    const { error } = await supabase
      .from('analytics_events')
      .insert([eventData]);
      
    if (error) {
      console.error('Analytics tracking error:', error);
    }
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

// Track page view
export const trackPageView = () => {
  trackEvent('page_view');
};

// Track conversions
export const trackConversion = (type: string, data?: Record<string, any>) => {
  trackEvent(type, data);
};

// Auto-track page views
if (typeof window !== 'undefined') {
  // Track initial page view
  setTimeout(() => trackPageView(), 100);
  
  // Track route changes
  let lastPath = window.location.pathname;
  const observer = new MutationObserver(() => {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      trackPageView();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}