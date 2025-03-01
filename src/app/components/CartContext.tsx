"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ประเภทตัวเลือกของสินค้า
interface OptionSelection {
  group_id: number;
  selected_items: number[];
}

interface CartItem {
  cart_id: string; // ใช้ cart_id แทน id
  id: string; // menu_id จริง
  name: string;
  price: number;
  image: string;
  quantity: number;
  shop_id: number;
  options: OptionSelection[];
  note?: string;
}

// ประเภทของ Context
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (cart_id: string) => void;
  updateQuantity: (cart_id: string, quantity: number) => void;
  getTotalQuantity: () => number;
}

// สร้าง Context
export const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook ใช้งานตะกร้า
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart ต้องถูกใช้ภายใน CartProvider");
  }
  return context;
};

// Provider ของตะกร้าสินค้า
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("❌ โหลดตะกร้าล้มเหลว:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const generateCartId = (item: CartItem) => {
    return `${item.id}-${JSON.stringify(item.options)}-${item.note || ""}`;
  };
  

  // เพิ่มสินค้าเข้าไปในตะกร้า
  const addToCart = (item: CartItem) => {
    const cart_id = generateCartId(item); // สร้าง cart_id

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.cart_id === cart_id);

      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.cart_id === cart_id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }

      return [...prevItems, { ...item, cart_id }];
    });
  };

  // ลบสินค้าจากตะกร้า
  const removeFromCart = (cart_id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cart_id !== cart_id));
  };

  // อัปเดตจำนวนสินค้า
  const updateQuantity = (cart_id: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cart_id === cart_id ? { ...item, quantity } : item
      )
    );
  };

  // คำนวณจำนวนสินค้าทั้งหมดในตะกร้า
  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, getTotalQuantity }}>
      {children}
    </CartContext.Provider>
  );
};