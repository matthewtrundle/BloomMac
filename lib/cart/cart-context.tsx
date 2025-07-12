'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Types
export interface CartItem {
  id: string;
  type: 'course' | 'addon' | 'physical' | 'service' | 'program';
  productId: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image?: string;
  metadata?: {
    courseId?: string;
    sessionType?: string;
    counselorLevel?: string;
    shippingRequired?: boolean;
    recurring?: boolean;
    duration?: string;
  };
}

export interface Discount {
  id: string;
  code: string;
  type: 'fixed' | 'percentage';
  amount: number;
  description: string;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  discounts: Discount[];
  discountAmount: number;
  total: number;
  isOpen: boolean;
  isLoading: boolean;
}

// Action types
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'APPLY_DISCOUNT'; payload: Discount }
  | { type: 'REMOVE_DISCOUNT'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_CART'; payload: CartState };

// Initial state
const initialState: CartState = {
  items: [],
  subtotal: 0,
  discounts: [],
  discountAmount: 0,
  total: 0,
  isOpen: false,
  isLoading: false,
};

// Helper functions
const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const calculateDiscountAmount = (subtotal: number, discounts: Discount[]): number => {
  return discounts.reduce((sum, discount) => {
    if (discount.type === 'fixed') {
      return sum + discount.amount;
    } else {
      return sum + (subtotal * discount.amount / 100);
    }
  }, 0);
};

// Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );

      let newItems;
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        newItems = [...state.items];
        newItems[existingItemIndex].quantity += action.payload.quantity;
      } else {
        // New item
        newItems = [...state.items, action.payload];
      }

      const subtotal = calculateSubtotal(newItems);
      const discountAmount = calculateDiscountAmount(subtotal, state.discounts);

      return {
        ...state,
        items: newItems,
        subtotal,
        discountAmount,
        total: subtotal - discountAmount,
        isOpen: true, // Open cart when item added
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const subtotal = calculateSubtotal(newItems);
      const discountAmount = calculateDiscountAmount(subtotal, state.discounts);

      return {
        ...state,
        items: newItems,
        subtotal,
        discountAmount,
        total: subtotal - discountAmount,
      };
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);

      const subtotal = calculateSubtotal(newItems);
      const discountAmount = calculateDiscountAmount(subtotal, state.discounts);

      return {
        ...state,
        items: newItems,
        subtotal,
        discountAmount,
        total: subtotal - discountAmount,
      };
    }

    case 'APPLY_DISCOUNT': {
      const newDiscounts = [...state.discounts, action.payload];
      const discountAmount = calculateDiscountAmount(state.subtotal, newDiscounts);

      return {
        ...state,
        discounts: newDiscounts,
        discountAmount,
        total: state.subtotal - discountAmount,
      };
    }

    case 'REMOVE_DISCOUNT': {
      const newDiscounts = state.discounts.filter(d => d.id !== action.payload);
      const discountAmount = calculateDiscountAmount(state.subtotal, newDiscounts);

      return {
        ...state,
        discounts: newDiscounts,
        discountAmount,
        total: state.subtotal - discountAmount,
      };
    }

    case 'CLEAR_CART':
      return initialState;

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
};

// Context
interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  applyDiscount: (discount: Discount) => void;
  removeDiscount: (discountId: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  hasPhysicalItems: boolean;
  hasServiceItems: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Local storage key
const CART_STORAGE_KEY = 'bloom-cart';

// Provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Failed to load cart from storage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Context value
  const value: CartContextType = {
    state,
    addItem: (item) => {
      const cartItem: CartItem = {
        ...item,
        id: `${item.productId}-${Date.now()}`,
      };
      dispatch({ type: 'ADD_ITEM', payload: cartItem });
    },
    removeItem: (itemId) => {
      dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    },
    updateQuantity: (itemId, quantity) => {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
    },
    applyDiscount: (discount) => {
      dispatch({ type: 'APPLY_DISCOUNT', payload: discount });
    },
    removeDiscount: (discountId) => {
      dispatch({ type: 'REMOVE_DISCOUNT', payload: discountId });
    },
    clearCart: () => {
      dispatch({ type: 'CLEAR_CART' });
    },
    toggleCart: () => {
      dispatch({ type: 'TOGGLE_CART' });
    },
    hasPhysicalItems: state.items.some(item => item.metadata?.shippingRequired),
    hasServiceItems: state.items.some(item => item.type === 'service'),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Hook to use cart
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Helper hook for common cart operations
export function useCartHelpers() {
  const { state, addItem } = useCart();

  const addCourse = (course: { id: string; name: string; price: number; image?: string }) => {
    addItem({
      type: 'course',
      productId: course.id,
      name: course.name,
      price: course.price,
      quantity: 1,
      image: course.image,
    });
  };

  const addWorkbookReview = (review: { id: string; name: string; price: number; courseId?: string }) => {
    addItem({
      type: 'service',
      productId: review.id,
      name: review.name,
      price: review.price,
      quantity: 1,
      metadata: {
        courseId: review.courseId,
        sessionType: 'workbook_review',
      },
    });
  };

  const addPhysicalProduct = (product: { id: string; name: string; price: number; image?: string }) => {
    addItem({
      type: 'physical',
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      metadata: {
        shippingRequired: true,
      },
    });
  };

  const getItemCount = () => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return {
    addCourse,
    addWorkbookReview,
    addPhysicalProduct,
    getItemCount,
  };
}