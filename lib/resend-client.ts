import { Resend } from 'resend';

// Centralized Resend client with error handling
let resendInstance: Resend | null = null;

export function getResendClient(): Resend | null {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      console.warn('[resend-client] RESEND_API_KEY is not set in environment variables');
      return null;
    }
    
    try {
      resendInstance = new Resend(apiKey);
    } catch (error) {
      console.error('[resend-client] Failed to initialize Resend:', error);
      return null;
    }
  }
  
  return resendInstance;
}

// Wrapper for sending emails with validation
export async function sendEmail(params: {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: any[];
  tags?: { name: string; value: string }[];
}) {
  // Validate required fields
  if (!params.to) {
    throw new Error('Email recipient (to) is required');
  }
  
  if (!params.from) {
    throw new Error('Email sender (from) is required');
  }
  
  if (!params.subject) {
    throw new Error('Email subject is required');
  }
  
  try {
    const client = getResendClient();
    
    if (!client) {
      throw new Error('Resend client is not initialized. Check RESEND_API_KEY.');
    }
    
    const result = await client.emails.send(params);
    return result;
  } catch (error) {
    console.error('[resend-client] Error sending email:', error);
    throw error;
  }
}