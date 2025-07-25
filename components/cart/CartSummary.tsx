'use client';

import React from 'react';
import { useCart } from '@/lib/cart/cart-context';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
}

export default function CartSummary({ showCheckoutButton = true }: CartSummaryProps) {
  const { state } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100);
  };

  // Default values if state is not available
  const subtotal = state?.subtotal || 0;
  const discounts = state?.discounts || [];
  const items = state?.items || [];
  const total = state?.total || 0;

  return (
    <div className="p-4 space-y-3">
      {/* Subtotal */}
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-medium">{formatPrice(subtotal)}</span>
      </div>

      {/* Discounts */}
      {discounts.map((discount) => (
        <div key={discount.id} className="flex justify-between text-sm">
          <span className="text-green-600">
            {discount.description}
          </span>
          <span className="text-green-600 font-medium">
            -{formatPrice(discount.type === 'fixed' ? discount.amount : (subtotal * discount.amount / 100))}
          </span>
        </div>
      ))}

      {/* Shipping note for physical items */}
      {items.some(item => item.metadata?.shippingRequired) && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-600">Calculated at checkout</span>
        </div>
      )}

      {/* Total */}
      <div className="border-t pt-3">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        
        {/* Payment info */}
        <p className="text-xs text-gray-500 mt-1">
          Payment plans available at checkout
        </p>
      </div>
    </div>
  );
}