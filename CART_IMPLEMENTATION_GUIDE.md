# Cart System Implementation Guide

## 🔄 Checkout Flow Comparison

### Current Single-Product Flow
```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌─────────┐
│ Course Page │ --> │ Enter Email  │ --> │   Stripe    │ --> │ Success │
│  ($297)     │     │    Modal     │     │  Checkout   │     │  Page   │
└─────────────┘     └──────────────┘     └─────────────┘     └─────────┘
     1 click            2 clicks             3 clicks          Complete
```

### New Multi-Product Cart Flow
```
┌─────────────┐     ┌──────────┐     ┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌─────────┐
│ Course Page │ --> │   Cart   │ --> │   Add-Ons   │ --> │    Review    │ --> │   Stripe    │ --> │ Success │
│ Add to Cart │     │  Drawer  │     │  Upsells    │     │   & Email    │     │  Checkout   │     │  Page   │
└─────────────┘     └──────────┘     └─────────────┘     └──────────────┘     └─────────────┘     └─────────┘
     1 click           2 clicks          3 clicks            4 clicks             5 clicks          Complete
```

## 🏗️ Technical Architecture

### 1. Cart State Management

```typescript
// lib/cart/cart-context.tsx
interface CartItem {
  id: string;
  type: 'course' | 'addon' | 'physical';
  productId: string;
  name: string;
  price: number;
  quantity: number;
  metadata?: {
    courseId?: string;
    sessionType?: string;
    counselorLevel?: string;
    shippingRequired?: boolean;
  };
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  discounts: Discount[];
  total: number;
  isOpen: boolean;
}

// Cart actions
const cartActions = {
  addItem: (product: Product) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  applyDiscount: (code: string) => void;
  clearCart: () => void;
};
```

### 2. Database Schema Updates

```sql
-- Add-on products table
CREATE TABLE addon_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('service', 'physical', 'digital')),
  price INTEGER NOT NULL, -- in cents
  
  -- Service-specific fields
  duration_minutes INTEGER,
  provider_type TEXT, -- 'dr_jana' or 'counselor'
  max_participants INTEGER,
  
  -- Physical product fields
  shipping_weight_oz INTEGER,
  inventory_count INTEGER DEFAULT 0,
  
  -- Metadata
  features JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bundle definitions
CREATE TABLE product_bundles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT CHECK (discount_type IN ('fixed', 'percentage')),
  discount_amount INTEGER NOT NULL,
  product_ids JSONB NOT NULL, -- Array of product IDs in bundle
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session bookings table
CREATE TABLE counseling_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT NOT NULL,
  counselor_id UUID REFERENCES counselors(id),
  session_type TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  zoom_link TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Counselor profiles
CREATE TABLE counselors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  credentials TEXT NOT NULL,
  bio TEXT,
  specialties JSONB DEFAULT '[]',
  hourly_rate INTEGER NOT NULL,
  is_available BOOLEAN DEFAULT true,
  rating DECIMAL(3,2),
  total_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Component Structure

```
components/
├── cart/
│   ├── CartProvider.tsx      // Context provider
│   ├── CartDrawer.tsx        // Slide-out cart
│   ├── CartItem.tsx          // Individual item display
│   ├── CartSummary.tsx       // Price breakdown
│   └── AddToCartButton.tsx   // Reusable button
├── checkout/
│   ├── CheckoutForm.tsx      // Multi-step form
│   ├── AddOnStep.tsx         // Upsell presentation
│   ├── ShippingStep.tsx      // Address collection
│   └── ReviewStep.tsx        // Final review
└── booking/
    ├── SessionCalendar.tsx   // Counselor availability
    ├── BookingModal.tsx      // Session booking
    └── CounselorCard.tsx     // Counselor profile
```

### 4. API Endpoints

```typescript
// New API routes needed

// Cart management
POST   /api/cart/add
DELETE /api/cart/remove
PUT    /api/cart/update
GET    /api/cart

// Product data
GET    /api/products/addons
GET    /api/products/bundles
GET    /api/products/recommendations

// Booking system
GET    /api/counselors/availability
POST   /api/bookings/create
PUT    /api/bookings/reschedule
DELETE /api/bookings/cancel

// Fulfillment
POST   /api/fulfillment/ship
POST   /api/fulfillment/schedule-session
```

### 5. Stripe Integration Updates

```typescript
// Updated checkout session creation
const session = await stripe.checkout.sessions.create({
  line_items: cart.items.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        description: item.description,
        metadata: {
          type: item.type,
          productId: item.productId
        }
      },
      unit_amount: item.price
    },
    quantity: item.quantity
  })),
  
  // Collect shipping for physical items
  shipping_address_collection: hasPhysicalItems ? {
    allowed_countries: ['US', 'CA']
  } : undefined,
  
  // Apply bundle discounts
  discounts: cart.discounts.map(d => ({
    coupon: d.couponId
  })),
  
  metadata: {
    cartId: cart.id,
    hasAddOns: cart.items.length > 1,
    requiresShipping: hasPhysicalItems,
    requiresScheduling: hasServiceItems
  }
});
```

### 6. Post-Purchase Automation

```typescript
// Webhook handler updates
switch (event.type) {
  case 'checkout.session.completed':
    // 1. Grant course access (existing)
    await grantCourseAccess(session);
    
    // 2. Process physical items
    if (session.metadata.requiresShipping) {
      await createShippingOrder(session);
    }
    
    // 3. Enable session booking
    if (session.metadata.requiresScheduling) {
      await enableSessionBooking(session);
    }
    
    // 4. Send appropriate emails
    await sendPurchaseEmails(session);
    break;
}
```

## 🎨 UI/UX Considerations

### Cart Drawer Design
- Slides in from right on desktop
- Full screen on mobile
- Shows item images and descriptions
- Quick quantity adjustments
- Prominent checkout button
- Bundle suggestions at bottom

### Add-On Presentation
- Show relevant add-ons based on cart contents
- Use urgency: "Add counseling support - only 3 spots left this week"
- Social proof: "73% of moms add workbook set"
- Clear value propositions
- Easy skip option

### Checkout Form
- Progress indicator
- Guest checkout option
- Save cart for later
- Express checkout (Apple Pay, Google Pay)
- Clear return policy

## 📊 Analytics Implementation

```typescript
// Track cart events
analytics.track('Product Added to Cart', {
  productId: product.id,
  productName: product.name,
  productType: product.type,
  price: product.price,
  cartValue: cart.total
});

analytics.track('Checkout Started', {
  cartItems: cart.items.length,
  cartValue: cart.total,
  hasAddOns: cart.items.some(i => i.type === 'addon'),
  bundleApplied: cart.discounts.length > 0
});

// Track conversion funnel
- Course page views
- Add to cart rate
- Cart abandonment rate
- Add-on attach rate
- Checkout completion rate
```

## 🚦 Implementation Timeline

### Week 1-2: Foundation
- [ ] Cart context and state management
- [ ] Cart drawer UI component
- [ ] Update product pages with cart buttons
- [ ] Session storage for cart persistence

### Week 3-4: Add-On Products
- [ ] Create add-on product database
- [ ] Build add-on selection UI
- [ ] Implement bundle logic
- [ ] Add recommendation engine

### Week 5-6: Checkout Flow
- [ ] Multi-step checkout form
- [ ] Shipping address collection
- [ ] Update Stripe integration
- [ ] Test payment processing

### Week 7-8: Fulfillment
- [ ] Counselor booking system
- [ ] Shipping integration
- [ ] Automated emails
- [ ] Admin dashboard updates

## 🧪 Testing Strategy

1. **Unit Tests**: Cart calculations, discount logic
2. **Integration Tests**: API endpoints, Stripe webhooks
3. **E2E Tests**: Complete purchase flows
4. **Load Testing**: Concurrent cart sessions
5. **User Testing**: Beta group feedback

## 🔐 Security Considerations

- Validate cart contents server-side
- Prevent price manipulation
- Secure session booking endpoints
- Rate limit cart operations
- Audit trail for all transactions

---

This implementation guide provides the technical foundation for transforming your single-product checkout into a robust cart system that supports add-ons and bundles while maintaining a smooth user experience.