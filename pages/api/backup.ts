import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { type = 'all' } = req.query;

  try {
    switch (type) {
      case 'subscribers':
        const subscribersPath = path.join(DATA_DIR, 'subscribers.json');
        try {
          const data = await fs.readFile(subscribersPath, 'utf-8');
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Content-Disposition', `attachment; filename=subscribers-${new Date().toISOString().split('T')[0]}.json`);
          res.status(200).send(data);
        } catch {
          res.status(200).json([]);
        }
        break;

      case 'analytics':
        const analyticsPath = path.join(DATA_DIR, 'analytics.json');
        try {
          const data = await fs.readFile(analyticsPath, 'utf-8');
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Content-Disposition', `attachment; filename=analytics-${new Date().toISOString().split('T')[0]}.json`);
          res.status(200).send(data);
        } catch {
          res.status(200).json([]);
        }
        break;

      case 'csv':
        // Export subscribers as CSV
        const subscribersDataPath = path.join(DATA_DIR, 'subscribers.json');
        try {
          const data = await fs.readFile(subscribersDataPath, 'utf-8');
          const subscribers = JSON.parse(data);
          
          const csv = [
            'Email,First Name,Last Name,Status,Signup Date,Source,Interests',
            ...subscribers.map((s: any) => 
              [
                s.email,
                s.firstName || '',
                s.lastName || '',
                s.status,
                new Date(s.timestamp).toISOString(),
                s.signupSource,
                (s.interests || []).join(';')
              ].map(field => `"${field}"`).join(',')
            )
          ].join('\n');
          
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', `attachment; filename=subscribers-${new Date().toISOString().split('T')[0]}.csv`);
          res.status(200).send(csv);
        } catch {
          res.status(200).send('Email,First Name,Last Name,Status,Signup Date,Source,Interests\n');
        }
        break;

      case 'all':
        // Return all data as a combined JSON
        const allData: any = {
          exportDate: new Date().toISOString(),
          subscribers: [],
          analytics: []
        };

        try {
          const subData = await fs.readFile(path.join(DATA_DIR, 'subscribers.json'), 'utf-8');
          allData.subscribers = JSON.parse(subData);
        } catch {}

        try {
          const analyticsData = await fs.readFile(path.join(DATA_DIR, 'analytics.json'), 'utf-8');
          allData.analytics = JSON.parse(analyticsData);
        } catch {}

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=bloom-backup-${new Date().toISOString().split('T')[0]}.json`);
        res.status(200).json(allData);
        break;

      default:
        res.status(400).json({ error: 'Invalid backup type' });
    }
  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).json({ error: 'Failed to generate backup' });
  }
}