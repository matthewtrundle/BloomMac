// Heatmap click tracking system
import { analytics } from './analytics';

interface ClickData {
  x: number;
  y: number;
  elementType: string;
  elementText?: string;
  elementId?: string;
  elementClass?: string;
  pageX: number;
  pageY: number;
  viewportWidth: number;
  viewportHeight: number;
  pageWidth: number;
  pageHeight: number;
  timestamp: number;
}

class HeatmapTracker {
  private clickBuffer: ClickData[] = [];
  private flushInterval: number = 5000; // Send data every 5 seconds
  private maxBufferSize: number = 50; // Send if buffer reaches 50 clicks
  private flushTimer: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    // Track all clicks on the page
    document.addEventListener('click', this.handleClick.bind(this), true);
    
    // Start flush timer
    this.startFlushTimer();
    
    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flush();
    });
  }

  private handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    
    // Get element information
    const elementType = target.tagName.toLowerCase();
    const elementId = target.id || undefined;
    const elementClass = target.className || undefined;
    let elementText = target.textContent?.trim().substring(0, 50) || undefined;
    
    // For buttons and links, get more specific text
    if (elementType === 'button' || elementType === 'a') {
      elementText = target.innerText?.trim() || elementText;
    }
    
    // Get click position data
    const clickData: ClickData = {
      x: event.clientX,
      y: event.clientY,
      pageX: event.pageX,
      pageY: event.pageY,
      elementType,
      elementId,
      elementClass,
      elementText,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      pageWidth: document.documentElement.scrollWidth,
      pageHeight: document.documentElement.scrollHeight,
      timestamp: Date.now()
    };
    
    // Add to buffer
    this.clickBuffer.push(clickData);
    
    // Check if we should flush
    if (this.clickBuffer.length >= this.maxBufferSize) {
      this.flush();
    }
  }

  private startFlushTimer() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    
    this.flushTimer = setInterval(() => {
      if (this.clickBuffer.length > 0) {
        this.flush();
      }
    }, this.flushInterval);
  }

  private async flush() {
    if (this.clickBuffer.length === 0) return;
    
    // Copy buffer and clear
    const clicks = [...this.clickBuffer];
    this.clickBuffer = [];
    
    try {
      // Send to analytics API
      const response = await fetch('/api/track-clicks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clicks,
          page: window.location.pathname,
          sessionId: analytics.getSessionId(),
          userId: analytics.getUserId()
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to send click data');
        // Put clicks back in buffer to retry
        this.clickBuffer.unshift(...clicks);
      }
    } catch (error) {
      console.error('Error sending click data:', error);
      // Put clicks back in buffer to retry
      this.clickBuffer.unshift(...clicks);
    }
  }

  // Get heatmap data for a specific page
  static async getHeatmapData(page: string, timeRange: string = '7d') {
    try {
      const response = await fetch(`/api/heatmap-data?page=${encodeURIComponent(page)}&range=${timeRange}`);
      if (!response.ok) throw new Error('Failed to fetch heatmap data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
      return null;
    }
  }
}

// Create singleton instance
export const heatmapTracker = new HeatmapTracker();

// Export for use in components
export const getHeatmapData = HeatmapTracker.getHeatmapData;