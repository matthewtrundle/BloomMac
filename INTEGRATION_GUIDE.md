# Cart System Integration Guide

## 🚀 Quick Start Integration

### Step 1: Add CartProvider to Layout

Update your root layout to include the cart provider:

```typescript
// app/layout.tsx
import { CartProvider } from '@/lib/cart/cart-context';
import CartDrawer from '@/components/cart/CartDrawer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {/* Your existing layout components */}
          {children}
          <CartDrawer /> {/* Add this - it will be hidden by default */}
        </CartProvider>
      </body>
    </html>
  );
}
```

### Step 2: Add Cart Icon to Navigation

Add a cart icon to your header/navigation:

```typescript
// components/navigation/Header.tsx (or similar)
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';

export default function Header() {
  const { state, toggleCart } = useCart();
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header>
      {/* Your existing nav items */}
      
      <button
        onClick={toggleCart}
        className="relative p-2 hover:bg-gray-100 rounded-lg"
      >
        <ShoppingCart className="w-6 h-6" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>
    </header>
  );
}
```

### Step 3: Update Course Pages

Replace direct checkout buttons with Add to Cart:

```typescript
// app/courses/[id]/page.tsx
import AddToCartButton from '@/components/cart/AddToCartButton';

// In your course detail component:
<AddToCartButton
  product={{
    id: course.slug,
    name: course.title,
    price: course.price * 100, // Convert to cents
    type: 'course',
    image: course.image,
    description: course.subtitle,
  }}
  size="lg"
  className="w-full sm:w-auto"
>
  Add to Cart - ${course.price}
</AddToCartButton>
```

### Step 4: Update Stripe Integration

Update your Stripe checkout session creation:

```typescript
// pages/api/stripe/create-checkout-session.ts
import { CartItem } from '@/lib/cart/cart-context';

const session = await stripe.checkout.sessions.create({
  line_items: items.map((item: CartItem) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        description: item.description,
        images: item.image ? [item.image] : undefined,
        metadata: {
          type: item.type,
          productId: item.productId,
        },
      },
      unit_amount: item.price,
    },
    quantity: item.quantity,
  })),
  
  // Handle shipping for physical items
  shipping_address_collection: hasPhysicalItems ? {
    allowed_countries: ['US', 'CA'],
  } : undefined,
  
  // Rest of your config...
});
```

## 🛠️ Product Setup

### 1. Define Your Products

Create a products configuration file:

```typescript
// lib/products/catalog.ts
export const products = {
  courses: {
    'postpartum-wellness': {
      id: 'postpartum-wellness',
      name: 'Postpartum Wellness Foundations',
      price: 29700, // $297 in cents
      type: 'course',
      description: '6-week comprehensive program',
      image: '/images/courses/postpartum.jpg',
    },
    // Add other courses...
  },
  
  addons: {
    'express-review': {
      id: 'express-review',
      name: 'Express Workbook Review',
      price: 9700,
      type: 'service',
      metadata: {
        duration: '20 minutes',
        provider: 'Certified Counselor',
      },
    },
    // Add other add-ons...
  },
  
  packages: {
    'silver-package': {
      id: 'silver-package',
      name: 'Silver Package - Complete Support',
      price: 129700,
      type: 'package',
      includes: [
        'postpartum-wellness',
        'complete-review',
        'quick-connect-3pack',
        'partner-kit',
        'wellness-box',
      ],
    },
    // Add other packages...
  },
};
```

### 2. Create Package Pages

Create landing pages for each package:

```typescript
// app/packages/silver/page.tsx
import AddToCartButton from '@/components/cart/AddToCartButton';
import { products } from '@/lib/products/catalog';

export default function SilverPackagePage() {
  const silverPackage = products.packages['silver-package'];
  
  return (
    <div>
      {/* Package details, features, testimonials */}
      
      <AddToCartButton
        product={silverPackage}
        size="lg"
        variant="primary"
      >
        Get Complete Support - $1,297
      </AddToCartButton>
    </div>
  );
}
```

## 🧪 Testing Checklist

### Cart Functionality
- [ ] Add items to cart
- [ ] Update quantities
- [ ] Remove items
- [ ] Cart persists on page refresh
- [ ] Cart drawer opens/closes smoothly

### Checkout Flow
- [ ] All steps display correctly
- [ ] Add-ons show only relevant products
- [ ] Shipping step only shows for physical items
- [ ] Payment plans calculate correctly
- [ ] Form validation works

### Stripe Integration
- [ ] Checkout session creates successfully
- [ ] Multiple line items appear in Stripe
- [ ] Shipping address collected when needed
- [ ] Webhook handles completion

### Mobile Experience
- [ ] Cart drawer is full-width on mobile
- [ ] Checkout steps are readable
- [ ] Forms are easy to fill on mobile
- [ ] Payment options display well

## 🎨 Customization Options

### Theme Colors
Update the color scheme in your components:

```css
/* Replace purple-600 with your brand color */
.bg-purple-600 → .bg-bloompink
.text-purple-600 → .text-bloompink
.border-purple-600 → .border-bloompink
```

### Cart Behavior
Customize in cart-context.tsx:
- Auto-open cart on add (current)
- Show toast notification instead
- Redirect to cart page
- Mini cart in header

### Add-On Rules
Customize which add-ons show:
```typescript
// Only show workbook reviews if course in cart
const showWorkbookReviews = state.items.some(item => item.type === 'course');

// Only show wellness box once
const hasWellnessBox = state.items.some(item => item.productId === 'wellness-box');
```

## 🚦 Go-Live Checklist

### Environment Variables
```env
# Add to .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
COURSES_ENABLED=true
```

### Database
- [ ] Run course payment schema migration
- [ ] Verify course_purchases table exists
- [ ] Verify user_course_access table exists
- [ ] Test with a purchase

### Stripe Dashboard
- [ ] Create products for courses
- [ ] Create products for add-ons
- [ ] Set up webhook endpoint
- [ ] Enable payment methods

### Content
- [ ] All product images uploaded
- [ ] Product descriptions finalized
- [ ] Package pages created
- [ ] Terms of service updated

## 🤝 Support

### Common Issues

**Cart not persisting**: Check localStorage is enabled
**Stripe errors**: Verify API keys are correct
**Add-ons not showing**: Check product type logic
**Payment plans missing**: Verify total is above threshold

### Debugging

```typescript
// Log cart state
console.log('Cart:', state);

// Check localStorage
console.log('Saved cart:', localStorage.getItem('bloom-cart'));

// Verify Stripe
console.log('Stripe loaded:', window.Stripe);
```

---

Ready to launch your new cart system! 🎉