import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabase';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { clicks, page, sessionId, userId } = req.body;
    
    if (!clicks || !Array.isArray(clicks) || clicks.length === 0) {
      return res.status(400).json({ error: 'No click data provided' });
    }
    
    // Store each click as an analytics event with detailed data
    const clickEvents = clicks.map((click: ClickData) => ({
      type: 'click',
      page: page || '/',
      session_id: sessionId || null,
      user_id: userId || null,
      data: {
        ...click,
        userAgent: req.headers['user-agent'],
        referrer: req.headers.referer || 'direct'
      }
    }));
    
    // Batch insert click events
    const { error } = await supabaseAdmin
      .from('analytics_events')
      .insert(clickEvents);
      
    if (error) {
      console.error('Error saving click data:', error);
      return res.status(500).json({ error: 'Failed to save click data' });
    }
    
    // Also store aggregated click data for faster heatmap generation
    const clickHeatmapData = clicks.map((click: ClickData) => ({
      page: page || '/',
      x_percent: (click.x / click.viewportWidth) * 100, // Store as percentage for responsive
      y_percent: (click.y / click.viewportHeight) * 100,
      element_type: click.elementType,
      element_text: click.elementText,
      element_id: click.elementId,
      viewport_width: click.viewportWidth,
      viewport_height: click.viewportHeight,
      session_id: sessionId || null
    }));
    
    // Store in click_heatmap table for optimized queries
    try {
      await supabaseAdmin
        .from('click_heatmap')
        .insert(clickHeatmapData);
    } catch (err: any) {
      // If table doesn't exist, just log error
      console.log('Click heatmap table may not exist yet:', err.message);
    }
    
    return res.status(200).json({ 
      success: true, 
      tracked: clicks.length 
    });
    
  } catch (error) {
    console.error('Error tracking clicks:', error);
    return res.status(500).json({ error: 'Failed to track clicks' });
  }
}