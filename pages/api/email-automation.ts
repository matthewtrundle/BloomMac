import { NextApiRequest, NextApiResponse } from 'next';
import { enhancedEmailTemplates, personalizeEmail } from '@/lib/email-templates/enhanced-emails';
import { getResendClient } from '@/lib/resend-client';

interface EmailSequenceData {
  email: string;
  name: string;
  sequenceType: 'contact_followup' | 'booking_confirmation' | 'lead_nurture' | 'newsletter';
  step: number | string;
  leadSource?: string;
  serviceInterest?: string;
  resourceName?: string;
  appointmentDetails?: any;
}

// Legacy template mapping for backward compatibility
const legacyStepMapping = {
  contact_followup: {
    1: 'immediate',
    2: 'followup72',
    3: 'resources7'
  },
  booking_confirmation: {
    1: 'confirmation',
    2: 'reminder24',
    3: 'followup48'
  },
  lead_nurture: {
    1: 'thankYou',
    2: 'helpful72',
    3: 'successStory7',
    4: 'readyWhen14'
  },
  newsletter: {
    1: 'welcome',
    2: 'day3',
    3: 'day7',
    4: 'day14',
    5: 'day30'
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { email, name, sequenceType, step, leadSource, serviceInterest, resourceName, appointmentDetails }: EmailSequenceData = req.body;

  if (!email || !name || !sequenceType || !step) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Get the enhanced template
    const sequenceTemplates = enhancedEmailTemplates[sequenceType];
    if (!sequenceTemplates) {
      return res.status(400).json({ error: 'Invalid sequence type' });
    }

    // Map legacy numeric steps to new string keys
    let templateKey = step;
    if (typeof step === 'number' && legacyStepMapping[sequenceType]) {
      templateKey = legacyStepMapping[sequenceType][step] || step;
    }

    const template = sequenceTemplates[templateKey];
    if (!template) {
      return res.status(400).json({ error: 'Invalid step for sequence' });
    }

    // Personalize the email
    const personalizedEmail = personalizeEmail(template, {
      firstName: name,
      name,
      resourceName,
      appointmentDetails
    });

    const isDevMode = process.env.NODE_ENV === 'development';
    const emailTo = isDevMode ? 'matthewtrundle@gmail.com' : email;

    console.log(`Sending enhanced email automation: ${sequenceType} step ${step} (${templateKey}) to ${emailTo}`);

    const resend = getResendClient();
    if (!resend) {
      throw new Error('Email service not configured');
    }
    
    const data = await resend.emails.send({
      from: 'Dr. Jana Rundle <jana@bloompsychologynorthaustin.com>',
      to: emailTo,
      subject: `${isDevMode ? '[TEST] ' : ''}${personalizedEmail.subject}`,
      html: personalizedEmail.content,
      tags: [
        { name: 'sequence', value: sequenceType },
        { name: 'step', value: String(step) },
        { name: 'enhanced', value: 'true' }
      ]
    });

    console.log('Enhanced email automation sent successfully:', data);
    return res.status(200).json({ 
      success: true, 
      data,
      template: templateKey,
      sequence: sequenceType
    });

  } catch (error) {
    console.error('Enhanced email automation error:', error);
    return res.status(500).json({ error: 'Email send failed', details: error });
  }
}