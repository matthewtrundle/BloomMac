'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface AddToCartButtonProps {
  courseId: string;
  courseName: string;
  price: number; // in cents
  description?: string;
  image?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
}

export default function AddToCartButton({
  courseId,
  courseName,
  price,
  description,
  image,
  className = '',
  size = 'md',
  variant = 'primary'
}: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false);
  const { addItem, toggleCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-bloom-pink-500 to-bloom-pink-700 text-white hover:from-bloom-pink-600 hover:to-bloom-pink-800 shadow-lg hover:shadow-xl',
    secondary: 'bg-white border-2 border-bloom-pink-500 text-bloom-pink-600 hover:bg-bloom-pink-500 hover:text-white'
  };

  const handleAddToCart = () => {
    // Check if user is authenticated
    if (!user) {
      // Store the intended product in sessionStorage
      sessionStorage.setItem('intendedProduct', JSON.stringify({
        courseId,
        courseName,
        price,
        description,
        image
      }));
      // Redirect to sign up
      router.push('/auth/signup?redirect=/courses&requireAccount=true');
      return;
    }
    addItem({
      id: `course-${courseId}`,
      type: 'course',
      productId: courseId,
      name: courseName,
      description,
      price: price / 100, // Convert cents to dollars for cart
      quantity: 1,
      image,
      metadata: {
        courseId
      }
    });

    setIsAdded(true);
    
    // Show the cart drawer after a brief delay
    setTimeout(() => {
      toggleCart();
    }, 500);

    // Reset the button after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <motion.button
      onClick={handleAddToCart}
      disabled={isAdded}
      className={`
        ${sizeClasses[size]} 
        ${isAdded ? 'bg-green-500 hover:bg-green-600' : variantClasses[variant]}
        rounded-lg font-medium transition-all duration-300 
        transform hover:-translate-y-0.5 active:translate-y-0
        flex items-center justify-center gap-2
        ${className}
      `}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {isAdded ? (
        <>
          <Check className="w-5 h-5" />
          <span>Added to Cart!</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          <span>Add to Cart</span>
        </>
      )}
    </motion.button>
  );
}