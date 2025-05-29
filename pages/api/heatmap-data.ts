import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { page = '/', range = '7d' } = req.query;
    
    // Convert range to days
    const days = range === '24h' ? 1 : 
                 range === '7d' ? 7 : 
                 range === '30d' ? 30 : 
                 range === '90d' ? 90 : 7;
    
    // Get heatmap data using the database function
    const { data: heatmapData, error } = await supabaseAdmin
      .rpc('get_heatmap_data', { 
        p_page: page as string, 
        p_days: days 
      });
      
    if (error) {
      console.error('Error fetching heatmap data:', error);
      
      // Fallback to direct query if function doesn't exist
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      
      const { data: rawData, error: fallbackError } = await supabaseAdmin
        .from('click_heatmap')
        .select('x_percent, y_percent, element_type, element_text')
        .eq('page', page)
        .gte('created_at', cutoffDate);
        
      if (fallbackError) {
        return res.status(500).json({ error: 'Failed to fetch heatmap data' });
      }
      
      // Process raw data into heatmap format
      const processedData = processHeatmapData(rawData || []);
      return res.status(200).json(processedData);
    }
    
    // Get click elements data for the page
    const { data: clickElements } = await supabaseAdmin
      .from('click_heatmap')
      .select('element_type, element_text, element_id')
      .eq('page', page)
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .limit(100);
    
    // Get total clicks and sessions for the period
    const { data: stats } = await supabaseAdmin
      .from('click_heatmap')
      .select('session_id')
      .eq('page', page)
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());
    
    const totalClicks = stats?.length || 0;
    const uniqueSessions = new Set(stats?.map(s => s.session_id)).size;
    
    return res.status(200).json({
      heatmapData: heatmapData || [],
      clickElements: summarizeClickElements(clickElements || []),
      stats: {
        totalClicks,
        uniqueSessions,
        period: range,
        page: page as string
      }
    });
    
  } catch (error) {
    console.error('Heatmap API error:', error);
    return res.status(500).json({ error: 'Failed to generate heatmap data' });
  }
}

// Process raw click data into heatmap grid
function processHeatmapData(clicks: any[]) {
  const grid = new Map<string, number>();
  
  clicks.forEach(click => {
    // Round to nearest 2% for grid
    const x = Math.round(click.x_percent / 2) * 2;
    const y = Math.round(click.y_percent / 2) * 2;
    const key = `${x},${y}`;
    
    grid.set(key, (grid.get(key) || 0) + 1);
  });
  
  // Find max clicks for intensity calculation
  const maxClicks = Math.max(...grid.values(), 1);
  
  // Convert to array format
  return Array.from(grid.entries()).map(([key, count]) => {
    const [x, y] = key.split(',').map(Number);
    return {
      x_percent: x,
      y_percent: y,
      click_count: count,
      intensity: (count / maxClicks) * 100
    };
  });
}

// Summarize clicked elements
function summarizeClickElements(elements: any[]) {
  const summary = new Map<string, { count: number; type: string }>();
  
  elements.forEach(el => {
    const key = el.element_text || el.element_id || el.element_type;
    if (key) {
      const existing = summary.get(key) || { count: 0, type: el.element_type };
      existing.count++;
      summary.set(key, existing);
    }
  });
  
  // Convert to array and sort by count
  return Array.from(summary.entries())
    .map(([element, data]) => ({
      element,
      ...data
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20); // Top 20 clicked elements
}