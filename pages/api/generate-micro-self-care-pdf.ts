import { NextApiRequest, NextApiResponse } from 'next';

const microSelfCareRituals = [
  {
    id: 1,
    title: 'Three Deep Breaths',
    time: '30 seconds',
    description: 'Inhale for 4 counts, hold for 4, exhale for 6. Reset your nervous system instantly.',
    category: 'Mindfulness',
    icon: '🫁',
    howTo: 'Place one hand on chest, one on belly. Breathe so only the belly hand moves.'
  },
  {
    id: 2,
    title: 'Gratitude Pause',
    time: '1 minute',
    description: 'Name three things you\'re grateful for right now, however small.',
    category: 'Mental',
    icon: '🙏',
    howTo: 'Look around and find one thing you see, one thing you feel, and one person you appreciate.'
  },
  {
    id: 3,
    title: 'Hand & Face Massage',
    time: '2 minutes',
    description: 'Massage your hands and temples while applying lotion or oil.',
    category: 'Physical',
    icon: '👐',
    howTo: 'Use circular motions on palms, then gently massage temples and forehead.'
  },
  {
    id: 4,
    title: 'Warm Tea Ritual',
    time: '2 minutes',
    description: 'Make tea mindfully, focusing on the warmth, steam, and first sip.',
    category: 'Mindfulness',
    icon: '🍵',
    howTo: 'Hold the warm mug, breathe in the steam, and take three mindful sips.'
  },
  {
    id: 5,
    title: 'Affirmation Mirror Moment',
    time: '1 minute',
    description: 'Look in the mirror and say one kind thing to yourself.',
    category: 'Mental',
    icon: '🪞',
    howTo: 'Make eye contact with yourself and say: "I am doing my best, and that is enough."'
  },
  {
    id: 6,
    title: 'Phone-Free Minutes',
    time: '2 minutes',
    description: 'Put your phone in another room and just be present with yourself.',
    category: 'Mental',
    icon: '📱',
    howTo: 'Set your phone aside and notice what you see, hear, and feel right now.'
  },
  {
    id: 7,
    title: 'Body Scan Check-in',
    time: '90 seconds',
    description: 'Quickly scan from head to toe, noticing any tension and releasing it.',
    category: 'Physical',
    icon: '🧘',
    howTo: 'Start at your forehead, notice and relax each body part down to your toes.'
  },
  {
    id: 8,
    title: 'Fresh Air Moment',
    time: '1 minute',
    description: 'Step outside or open a window and take five deep breaths of fresh air.',
    category: 'Physical',
    icon: '🌿',
    howTo: 'Focus on the air entering your lungs and how it feels on your skin.'
  },
  {
    id: 9,
    title: 'Gentle Stretches',
    time: '2 minutes',
    description: 'Roll your shoulders, stretch your neck, and twist your spine gently.',
    category: 'Physical',
    icon: '🤸',
    howTo: 'Shoulder rolls (5 each way), neck side-to-side, gentle spinal twist both directions.'
  },
  {
    id: 10,
    title: 'Loving Touch',
    time: '1 minute',
    description: 'Give yourself a gentle hug or place your hand on your heart.',
    category: 'Emotional',
    icon: '💗',
    howTo: 'Wrap your arms around yourself or place hand on heart and say "I am loved."'
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Create a simple HTML document that can be printed as PDF
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>10 Tiny Self-Care Rituals - Bloom Psychology</title>
        <style>
          @page {
            margin: 0.75in;
          }
          body {
            font-family: Georgia, serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          h1 {
            color: #C06B93;
            text-align: center;
            font-size: 28px;
            margin-bottom: 10px;
          }
          .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-style: italic;
          }
          .ritual {
            margin-bottom: 25px;
            page-break-inside: avoid;
            border-left: 3px solid #F8BBD0;
            padding-left: 15px;
          }
          .ritual-header {
            display: flex;
            align-items: baseline;
            margin-bottom: 5px;
          }
          .ritual-number {
            color: #C06B93;
            font-weight: bold;
            font-size: 18px;
            margin-right: 10px;
          }
          .ritual-title {
            font-size: 18px;
            font-weight: bold;
            color: #444;
          }
          .ritual-time {
            color: #888;
            font-size: 14px;
            margin-left: 10px;
          }
          .ritual-description {
            margin: 8px 0;
            color: #555;
          }
          .ritual-howto {
            background: #FFF0F5;
            padding: 10px;
            border-radius: 5px;
            font-size: 14px;
            color: #666;
          }
          .ritual-howto strong {
            color: #C06B93;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #888;
            font-size: 12px;
            border-top: 1px solid #DDD;
            padding-top: 20px;
          }
          .intro {
            text-align: center;
            margin-bottom: 30px;
            color: #666;
            font-style: italic;
          }
          .category {
            display: inline-block;
            background: #F8BBD0;
            color: #C06B93;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            margin-left: 10px;
          }
        </style>
      </head>
      <body>
        <h1>10 Tiny Self-Care Rituals That Take Less Than 2 Minutes</h1>
        <p class="subtitle">From Bloom Psychology North Austin</p>
        
        <p class="intro">
          Self-care doesn't have to be time-consuming or complicated. These micro-moments of care 
          can be woven into your busiest days to help you reset, recharge, and reconnect with yourself.
        </p>

        ${microSelfCareRituals.map((ritual, index) => `
          <div class="ritual">
            <div class="ritual-header">
              <span class="ritual-number">${index + 1}.</span>
              <span class="ritual-title">${ritual.title}</span>
              <span class="ritual-time">(${ritual.time})</span>
              <span class="category">${ritual.category}</span>
            </div>
            <p class="ritual-description">${ritual.description}</p>
            <div class="ritual-howto">
              <strong>How to:</strong> ${ritual.howTo}
            </div>
          </div>
        `).join('')}

        <div class="footer">
          <p><strong>Remember:</strong> Self-care isn't selfish—it's essential for your wellbeing and your family's.</p>
          <p>For more resources and support, visit us at:</p>
          <p><strong>bloompsychologynorthaustin.com</strong></p>
          <p>© ${new Date().getFullYear()} Bloom Psychology North Austin. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    // Set headers for HTML response that can be converted to PDF
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', 'inline; filename="10-tiny-self-care-rituals.html"');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}