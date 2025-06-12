// Test mode configuration for Stripe
// This allows testing the payment flow without a real Stripe account

export const isTestMode = () => {
  return !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'test_mode';
};

export const TEST_PRODUCTS = {
  'postpartum-wellness-foundations': {
    priceId: 'price_test_postpartum',
    amount: 19700,
    currency: 'usd',
    name: 'Postpartum Wellness Foundations',
    description: '6-week comprehensive course for new mothers',
    features: [
      '24 video lessons',
      'Interactive worksheets',
      'Community support',
      'Lifetime access',
      'Certificate of completion'
    ]
  },
  'anxiety-management-new-moms': {
    priceId: 'price_test_anxiety',
    amount: 12700,
    currency: 'usd', 
    name: 'Anxiety Management for New Moms',
    description: '4-week course focused on managing postpartum anxiety',
    features: [
      '16 video lessons',
      'Grounding techniques',
      'Daily practices',
      'Support resources'
    ]
  },
  'partner-support-bootcamp': {
    priceId: 'price_test_partner',
    amount: 9700,
    currency: 'usd',
    name: 'Partner Support Bootcamp',
    description: '3-week course for partners of new mothers',
    features: [
      '12 video lessons',
      'Communication tools',
      'Action plans',
      'Partner workbook'
    ]
  }
};

// Mock Stripe checkout session for testing
export const createTestCheckoutSession = async (courseId: string, customerEmail: string) => {
  const product = TEST_PRODUCTS[courseId as keyof typeof TEST_PRODUCTS];
  
  if (!product) {
    throw new Error('Invalid course ID');
  }

  // Generate a test session ID
  const sessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  
  // In test mode, return a mock checkout URL
  return {
    sessionId,
    url: `/checkout/test?session_id=${sessionId}&course=${courseId}&email=${encodeURIComponent(customerEmail)}&amount=${product.amount}`,
    success: true
  };
};

// Test credit card numbers for Stripe test mode
export const TEST_CARDS = {
  success: {
    number: '4242 4242 4242 4242',
    description: 'Succeeds and immediately processes the payment'
  },
  decline: {
    number: '4000 0000 0000 0002',
    description: 'Always declines with a generic card error'
  },
  insufficient: {
    number: '4000 0000 0000 9995',
    description: 'Declines with insufficient funds error'
  },
  authentication: {
    number: '4000 0025 0000 3155',
    description: 'Requires 3D Secure authentication'
  }
};