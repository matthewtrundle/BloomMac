'use client';

import React from 'react';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import { useRouter } from 'next/navigation';

export default function CartDrawer() {
  const { state, toggleCart, clearCart } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    toggleCart();
    router.push('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          state.isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          state.isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold">Your Cart</h2>
              {state.items.length > 0 && (
                <span className="bg-purple-100 text-purple-700 text-sm px-2 py-0.5 rounded-full">
                  {state.items.reduce((sum, item) => sum + item.quantity, 0)} items
                </span>
              )}
            </div>
            <button
              onClick={toggleCart}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Contents */}
          <div className="flex-1 overflow-y-auto">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 mb-6">
                  Add courses or services to get started
                </p>
                <button
                  onClick={toggleCart}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {state.items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
                
                {/* Bundle Suggestion */}
                {state.items.some(item => item.type === 'course') && 
                 !state.items.some(item => item.productId === 'workbook-review') && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-purple-900 mb-1">
                      Enhance your learning
                    </p>
                    <p className="text-sm text-purple-700 mb-3">
                      Add a workbook review for personalized feedback
                    </p>
                    <button
                      onClick={() => {
                        // This would add the workbook review
                        console.log('Add workbook review');
                      }}
                      className="text-sm font-medium text-purple-600 hover:text-purple-700"
                    >
                      Add Review (+$97) →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer with Summary */}
          {state.items.length > 0 && (
            <div className="border-t">
              <CartSummary />
              
              <div className="p-4 space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button
                  onClick={clearCart}
                  className="w-full px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}