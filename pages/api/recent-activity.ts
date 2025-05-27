import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

const ANALYTICS_FILE = path.join(process.cwd(), 'data', 'analytics.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const limit = parseInt(req.query.limit as string) || 10;
    
    // Read analytics data
    let events = [];
    try {
      const data = await fs.readFile(ANALYTICS_FILE, 'utf-8');
      const allEvents = JSON.parse(data);
      
      // Sort by timestamp descending and limit
      events = allEvents
        .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    } catch (error) {
      // If file doesn't exist or is empty, return empty array
      events = [];
    }
    
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
}