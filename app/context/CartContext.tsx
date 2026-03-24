"use client";

import { createContext, useContext, useState, useEffect } from "react";

type CartItem = {
  product: any;
  quantity: number;
  giftBoxData?: any;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: any, quantity?: number, giftBoxData?: any) => void;
  removeFromCart: (productId: string, giftBoxData?: any) => void;
  clearCart: () => void;
  cartTotal: number;
  baseTotal: number;
  appliedCoupon: any | null;
  applyCoupon: (coupon: any) => void;
  removeCoupon: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("surpriso_cart");
    const savedCoupon = localStorage.getItem("surpriso_coupon");
    if (saved) {
      try { setCart(JSON.parse(saved)); } catch (e) {}
    }
    if (savedCoupon) {
      try { setAppliedCoupon(JSON.parse(savedCoupon)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("surpriso_cart", JSON.stringify(cart));
      if (appliedCoupon) {
        localStorage.setItem("surpriso_coupon", JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem("surpriso_coupon");
      }
    }
  }, [cart, appliedCoupon, isMounted]);

  const addToCart = (product: any, quantity = 1, giftBoxData?: any) => {
    setCart((prev) => {
      // For gift boxes, we usually want them as unique items even if the base product is same
      if (giftBoxData) {
        return [...prev, { product, quantity, giftBoxData }];
      }
      
      const existing = prev.find((item) => item.product._id === product._id && !item.giftBoxData);
      if (existing) {
        return prev.map((item) =>
          (item.product._id === product._id && !item.giftBoxData) ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string, giftBoxData?: any) => {
    setCart((prev) => prev.filter((item) => {
      if (giftBoxData) {
        return item.giftBoxData !== giftBoxData; // Simple reference check or deep compare
      }
      return item.product._id !== productId;
    }));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (coupon: any) => setAppliedCoupon(coupon);
  const removeCoupon = () => setAppliedCoupon(null);

  const baseTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  let cartTotal = baseTotal;

  if (appliedCoupon) {
    if (appliedCoupon.isPercentage) {
      cartTotal = baseTotal - (baseTotal * (appliedCoupon.discountAmount / 100));
    } else {
      cartTotal = baseTotal - appliedCoupon.discountAmount;
    }
  }
  cartTotal = Math.max(0, cartTotal);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal, baseTotal, appliedCoupon, applyCoupon, removeCoupon }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
