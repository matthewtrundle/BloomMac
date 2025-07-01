# Payment Flow Integration - Complete User Journey

## 🔄 **Current State Analysis**

### **Existing Payment Systems in Bloom:**
1. **Stripe Course Payments** - Already integrated for course purchases
2. **Calendly Integration** - Currently handles appointment booking
3. **New Appointment Payment System** - What we just built

## 🚨 **Potential Conflicts & Solutions**

### **Issue**: Multiple Payment Collection Points
- Course purchases use Stripe checkout
- Calendly may have its own payment collection
- Our new system wants to collect appointment payments

### **Solution**: Unified Payment Strategy

## 📋 **Recommended Payment Flow Integration**

### **Scenario 1: New User Journey**
```
1. User signs up via onboarding
   ↓
2. Completes profile (no payment required yet)
   ↓
3. Books first appointment via Calendly
   ↓
4. Redirected to payment method setup
   ↓
5. Payment authorized for appointment
   ↓
6. Future appointments use stored payment method
```

### **Scenario 2: Existing User Journey**
```
1. User has account + course access
   ↓
2. Books appointment via dashboard
   ↓
3. If no payment method: prompted to add one
   ↓
4. If payment method exists: auto-authorized
   ↓
5. Appointment confirmed
```

## 🛠️ **Implementation Strategy**

### **Phase 1: Disable Calendly Payments (Recommended)**
```typescript
// Update Calendly configuration to disable payment collection
const calendlyConfig = {
  url: 'https://calendly.com/bloom-psychology/consultation',
  // Remove any payment/pricing configuration
  // Let our system handle all payments
  prefill: {
    email: user.email,
    name: user.user_metadata?.full_name || '',
    customAnswers: {
      a1: user.id // Pass user ID for our system
    }
  }
};
```

### **Phase 2: Post-Calendly Payment Collection**
When Calendly webhook fires (appointment scheduled), redirect user to payment setup:

```typescript
// In Calendly webhook handler
case 'invitee.created':
  const userId = event.payload.questions_and_answers?.find(q => 
    q.question === 'User ID'
  )?.answer;
  
  // Check if user has payment method
  const paymentMethods = await getUserPaymentMethods(userId);
  
  if (paymentMethods.length === 0) {
    // Redirect to payment setup
    return redirect(`/appointments/payment-setup?appointment=${appointmentId}`);
  } else {
    // Auto-authorize payment with default method
    await createAppointmentPaymentIntent(userId, appointmentId, 150);
  }
```

## 🎯 **Specific Integration Points**

### **1. Onboarding Flow Update**
```typescript
// In components/onboarding/steps/CompleteStep.tsx
// Add optional payment method setup

const handleComplete = async () => {
  // Existing onboarding completion
  await completeOnboarding();
  
  // Check if user selected appointment access
  if (data.accessType === 'consultation') {
    // Redirect to appointment booking with payment setup
    router.push('/appointments/book-with-payment');
  } else {
    // Normal dashboard redirect
    router.push('/dashboard');
  }
};
```

### **2. Dashboard Integration**
```typescript
// In app/dashboard/page.tsx
// Add payment method check in appointment booking

const handleBookAppointment = async () => {
  const paymentMethods = await getUserPaymentMethods(user.id);
  
  if (paymentMethods.length === 0) {
    // Show payment setup modal first
    setShowPaymentSetup(true);
  } else {
    // Proceed to Calendly booking
    openCalendlyBooking();
  }
};
```

### **3. Appointment Scheduler Update**
```typescript
// In components/appointments/AppointmentScheduler.tsx
// Add payment requirement check

const openCalendly = async () => {
  // Check for payment method before opening Calendly
  const paymentMethods = await getUserPaymentMethods(user.id);
  
  if (paymentMethods.length === 0) {
    setShowPaymentSetup(true);
    return;
  }
  
  // Proceed with Calendly booking
  if (window.Calendly && user) {
    window.Calendly.initPopupWidget({
      url: `${calendlyUrl}${config.calendlyEvent}`,
      // ... rest of config
    });
  }
};
```

## 📱 **User Experience Flow**

### **First-Time Appointment Booking:**
1. User clicks "Book Appointment" 
2. System checks: "No payment method found"
3. Modal appears: "Add Payment Method to Continue"
4. User adds credit card via Stripe Elements
5. Payment method saved securely
6. Calendly booking window opens
7. User schedules appointment
8. Payment authorized automatically
9. Confirmation email sent

### **Subsequent Bookings:**
1. User clicks "Book Appointment"
2. System checks: "Payment method found ✓"
3. Calendly opens immediately
4. User schedules appointment  
5. Payment authorized automatically
6. Confirmation sent

## 🔒 **Security & Compliance**

### **Payment Method Storage:**
- All payment methods stored via Stripe (PCI compliant)
- No card details stored in our database
- Only Stripe payment method IDs stored
- Full tokenization for security

### **Payment Authorization:**
- Funds authorized (not charged) at booking
- Actual charge occurs 24 hours before appointment
- Failed authorization prevents booking confirmation

## 💡 **Recommended Implementation Order**

### **Week 1: Basic Integration**
1. Update onboarding to include optional payment setup
2. Add payment method check to dashboard appointment booking
3. Create payment setup modal component

### **Week 2: Calendly Integration**  
1. Disable Calendly payment collection
2. Update Calendly webhook to trigger payment flow
3. Add post-booking payment authorization

### **Week 3: Polish & Testing**
1. Test complete user journeys
2. Handle edge cases (failed payments, expired cards)
3. Add error handling and retry logic

## 🚫 **What NOT to Do**

### **Avoid These Conflicts:**
- Don't have both Calendly AND our system collect payments
- Don't store payment info in multiple places  
- Don't create competing checkout flows
- Don't complicate the user experience with multiple payment steps

### **Keep It Simple:**
- One payment method storage system (Stripe)
- One payment collection point (our system)
- One user interface for payment management
- Clear handoff between booking and payment

## 📊 **Testing Scenarios**

### **Test Cases to Verify:**
1. New user books first appointment (no payment method)
2. Existing user books appointment (has payment method)
3. Payment method expires during booking
4. User cancels during payment setup
5. Calendly booking fails after payment setup
6. Multiple payment methods (default selection)

## 🎯 **Success Metrics**

### **User Experience:**
- < 2 minutes from "Book Appointment" to confirmation
- < 5% payment setup abandonment rate
- Zero duplicate payment collections
- 100% payment authorization success rate

This integration ensures a smooth, unified payment experience while leveraging both Calendly's scheduling strengths and our automated payment management system.