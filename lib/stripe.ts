import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

// Client-side Stripe
export const getStripe = () => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable');
  }
  
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
};

// Server-side Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// Course pricing configuration
export const COURSE_PRICES = {
  'postpartum-wellness-foundations': {
    priceId: process.env.STRIPE_PRICE_POSTPARTUM_WELLNESS,
    amount: 19700, // $197.00 in cents
    currency: 'usd',
    name: 'Postpartum Wellness Foundations',
  },
  'anxiety-management-new-moms': {
    priceId: process.env.STRIPE_PRICE_ANXIETY_MANAGEMENT,
    amount: 12700, // $127.00 in cents
    currency: 'usd',
    name: 'Anxiety Management for New Moms',
  },
  'partner-support-bootcamp': {
    priceId: process.env.STRIPE_PRICE_PARTNER_SUPPORT,
    amount: 9700, // $97.00 in cents
    currency: 'usd',
    name: 'Partner Support Bootcamp',
  },
};

export type CourseId = keyof typeof COURSE_PRICES;