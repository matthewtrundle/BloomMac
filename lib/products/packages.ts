// Package definitions with maternal-focused naming
// Replacing "bro-like" names with nurturing, journey-based terminology

export interface Package {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number; // in cents
  originalPrice?: number; // for showing savings
  features: string[];
  products: {
    courses?: string[];
    addOns?: string[];
    services?: string[];
  };
  paymentOptions: {
    monthly?: number; // number of payments
    affirm?: boolean;
  };
  popular?: boolean;
  savings?: number;
}

export const packages: Package[] = [
  {
    id: 'first-steps',
    name: 'First Steps Package',
    tagline: 'Begin your healing journey with gentle support',
    description: 'Perfect for moms ready to start their wellness journey with foundational support and resources.',
    price: 39700, // $397
    originalPrice: 49100, // $491
    features: [
      'Any 1 Course of your choice',
      'Express Workbook Review (1 module)',
      'Partner Integration Kit',
      'Email support for 30 days',
      'Access to community forum'
    ],
    products: {
      courses: ['choose-one'],
      addOns: ['express-review', 'partner-kit']
    },
    paymentOptions: {
      monthly: 2, // 2 payments of $199
    },
    savings: 9400 // Save $94
  },
  {
    id: 'nurturing-support',
    name: 'Nurturing Support Package',
    tagline: 'Comprehensive care for your recovery journey',
    description: 'Our most popular package with complete support, personalized feedback, and beautiful keepsakes.',
    price: 129700, // $1,297
    originalPrice: 161800, // $1,618
    features: [
      'Postpartum Wellness Foundations Course',
      'Complete Workbook Review (all modules with Dr. Jana)',
      'Quick Connect 3-Pack Sessions',
      'Partner Integration Kit',
      'Wellness Box with printed materials',
      'Priority email support',
      '10% off future purchases'
    ],
    products: {
      courses: ['postpartum-wellness-foundations'],
      addOns: ['deep-dive-review', 'quick-connect-3pack', 'partner-kit', 'wellness-box']
    },
    paymentOptions: {
      monthly: 4, // 4 payments of $325
      affirm: true
    },
    popular: true,
    savings: 32100 // Save $321
  },
  {
    id: 'embraced-journey',
    name: 'Embraced Journey Package',
    tagline: 'Enhanced personal guidance for complete transformation',
    description: 'Everything you need for a supported transformation with personal attention from Dr. Jana.',
    price: 249700, // $2,497 (increased from $1,897 for better decoy effect)
    originalPrice: 301500, // $3,015
    features: [
      'All 3 Courses (lifetime access)',
      'Fast-Track Mini Program (3 sessions with Dr. Jana)',
      'Complete Workbook Review',
      'Quick Connect 3-Pack',
      'Partner Kit + Wellness Box',
      'Priority booking for New Mom Program',
      'Monthly group Q&A with Dr. Jana',
      '20% off future services'
    ],
    products: {
      courses: ['all-courses'],
      services: ['fast-track-mini'],
      addOns: ['deep-dive-review', 'quick-connect-3pack', 'partner-kit', 'wellness-box']
    },
    paymentOptions: {
      monthly: 6, // 6 payments of $417
      affirm: true
    },
    savings: 51800 // Save $518
  },
  {
    id: 'full-bloom',
    name: 'Full Bloom Experience',
    tagline: 'Complete wraparound care with Dr. Jana',
    description: 'Our premium offering with unlimited support, personal therapy, and everything you need to thrive.',
    price: 399700, // $3,997
    originalPrice: 520000, // $5,200
    features: [
      'New Mom Program (8 individual sessions with Dr. Jana)',
      'All 3 Courses with guided support',
      'Monthly workbook reviews for 6 months',
      'Unlimited Quick Connect sessions for 6 months',
      'Partner Kit + Premium Wellness Box',
      'VIP access to all new content',
      'Personal WhatsApp support channel',
      'Custom wellness plan',
      'Certificate of completion'
    ],
    products: {
      services: ['new-mom-program'],
      courses: ['all-courses'],
      addOns: ['monthly-reviews', 'unlimited-quick-connect', 'partner-kit', 'wellness-box-premium']
    },
    paymentOptions: {
      monthly: 8, // 8 payments of $500
      affirm: true
    },
    savings: 120300 // Save $1,203
  }
];

// Helper functions for package management
export function getPackageById(id: string): Package | undefined {
  return packages.find(pkg => pkg.id === id);
}

export function getPopularPackage(): Package | undefined {
  return packages.find(pkg => pkg.popular);
}

export function formatPackagePrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price / 100);
}

export function getMonthlyPayment(pkg: Package): string {
  if (!pkg.paymentOptions.monthly) return '';
  const monthlyAmount = pkg.price / pkg.paymentOptions.monthly;
  return formatPackagePrice(monthlyAmount);
}

// Payment messaging helpers
export function getPaymentMessage(pkg: Package): string {
  if (pkg.paymentOptions.monthly === 2) {
    return `Start today for just ${getMonthlyPayment(pkg)}`;
  } else if (pkg.paymentOptions.monthly) {
    return `Most moms choose ${pkg.paymentOptions.monthly} payments of ${getMonthlyPayment(pkg)}`;
  }
  return 'Flexible payment options available';
}