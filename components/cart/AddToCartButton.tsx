'use client';

import React, { useState } from 'react';
import { ShoppingCart, Plus } from 'lucide-react';
import { useCart, useCartHelpers } from '@/lib/cart/cart-context';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    type: 'course' | 'addon' | 'physical' | 'service' | 'program';
    image?: string;
    description?: string;
    metadata?: Record<string, any>;
  };
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export default function AddToCartButton({
  product,
  variant = 'primary',
  size = 'md',
  className = '',
  showIcon = true,
  children,
}: AddToCartButtonProps) {
  const { addItem, state, toggleCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Check if item is already in cart
  const isInCart = state.items.some(item => item.productId === product.id);

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    try {
      addItem({
        type: product.type,
        productId: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: 1,
        image: product.image,
        metadata: product.metadata,
      });

      // Brief delay for visual feedback
      setTimeout(() => {
        setIsAdding(false);
      }, 500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAdding(false);
    }
  };

  const handleViewCart = () => {
    toggleCart();
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-gradient-to-r from-bloom-pink to-bloom-pink-dark text-white hover:from-bloom-pink-dark hover:to-bloom-pink border-bloom-pink',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 border-gray-600',
    outline: 'bg-transparent text-bloom-pink border-bloom-pink hover:bg-bloom-pink/10',
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2 
    font-medium rounded-lg border transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bloom-pink
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `;

  if (isInCart) {
    return (
      <button
        onClick={handleViewCart}
        className={`${baseClasses} bg-green-600 text-white hover:bg-green-700 border-green-600`}
      >
        {showIcon && <ShoppingCart className="w-4 h-4" />}
        <span>View in Cart</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={baseClasses}
    >
      {isAdding ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Adding...</span>
        </>
      ) : (
        <>
          {showIcon && <Plus className="w-4 h-4" />}
          <span>{children || 'Add to Cart'}</span>
        </>
      )}
    </button>
  );
}