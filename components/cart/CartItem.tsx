'use client';

import React from 'react';
import Image from 'next/image';
import { Trash2, Plus, Minus, Package, Calendar, BookOpen } from 'lucide-react';
import { CartItem as CartItemType, useCart } from '@/lib/cart/cart-context';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCart();

  const getIcon = () => {
    switch (item.type) {
      case 'course':
        return <BookOpen className="w-4 h-4 text-purple-600" />;
      case 'physical':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'service':
        return <Calendar className="w-4 h-4 text-green-600" />;
      default:
        return null;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex gap-4">
        {/* Image or Icon */}
        <div className="flex-shrink-0">
          {item.image ? (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              {getIcon()}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{item.name}</h3>
          {item.description && (
            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
          )}
          
          {/* Metadata badges */}
          <div className="flex flex-wrap gap-2 mt-2">
            {item.type === 'physical' && (
              <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                <Package className="w-3 h-3" />
                Ships in 5-7 days
              </span>
            )}
            {item.metadata?.duration && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                {item.metadata.duration}
              </span>
            )}
            {item.metadata?.sessionType === 'workbook_review' && (
              <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                Personalized Review
              </span>
            )}
          </div>

          {/* Price and Quantity */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              {/* Quantity selector for non-service items */}
              {item.type !== 'service' && item.type !== 'program' ? (
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:bg-gray-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-gray-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-900">
                {formatPrice(item.price * item.quantity)}
              </span>
              <button
                onClick={() => removeItem(item.id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}