import fs from 'fs/promises';
import path from 'path';

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'subscribers.json');

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  timestamp: string;
  status: 'active' | 'unsubscribed';
  tags: string[];
  signupSource: 'website' | 'consultation' | 'blog' | 'new-mom-program' | 'admin';
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
  };
}

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Load subscribers from file
export async function loadSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(SUBSCRIBERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    console.log('No existing subscribers file, starting fresh');
    return [];
  }
}

// Save subscribers to file
export async function saveSubscribers(subscribers: NewsletterSubscriber[]): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
    
    // Also create a backup with timestamp
    const backupDir = path.join(process.cwd(), 'data', 'backups');
    await fs.mkdir(backupDir, { recursive: true });
    
    const timestamp = new Date().toISOString().split('T')[0];
    const backupFile = path.join(backupDir, `subscribers-${timestamp}.json`);
    await fs.writeFile(backupFile, JSON.stringify(subscribers, null, 2));
    
    console.log(`Saved ${subscribers.length} subscribers to file and backup`);
  } catch (error) {
    console.error('Error saving subscribers:', error);
    throw error;
  }
}

// Add a new subscriber
export async function addSubscriber(subscriber: Omit<NewsletterSubscriber, 'id' | 'timestamp'>): Promise<NewsletterSubscriber> {
  const subscribers = await loadSubscribers();
  
  // Check if already exists
  const existing = subscribers.find(s => s.email.toLowerCase() === subscriber.email.toLowerCase());
  if (existing) {
    if (existing.status === 'active') {
      throw new Error('Already subscribed');
    } else {
      // Reactivate
      existing.status = 'active';
      existing.timestamp = new Date().toISOString();
      await saveSubscribers(subscribers);
      return existing;
    }
  }
  
  // Create new subscriber
  const newSubscriber: NewsletterSubscriber = {
    ...subscriber,
    id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString()
  };
  
  subscribers.push(newSubscriber);
  await saveSubscribers(subscribers);
  
  return newSubscriber;
}

// Get all active subscribers
export async function getActiveSubscribers(): Promise<NewsletterSubscriber[]> {
  const subscribers = await loadSubscribers();
  return subscribers.filter(s => s.status === 'active');
}

// Unsubscribe
export async function unsubscribeEmail(email: string): Promise<boolean> {
  const subscribers = await loadSubscribers();
  const subscriber = subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
  
  if (subscriber && subscriber.status === 'active') {
    subscriber.status = 'unsubscribed';
    await saveSubscribers(subscribers);
    return true;
  }
  
  return false;
}

// Export subscribers as CSV
export async function exportSubscribersCSV(): Promise<string> {
  const subscribers = await loadSubscribers();
  const headers = ['Email', 'Name', 'Status', 'Signup Date', 'Source'];
  const rows = subscribers.map(s => [
    s.email,
    s.name || '',
    s.status,
    new Date(s.timestamp).toLocaleDateString(),
    s.signupSource
  ]);
  
  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csv;
}