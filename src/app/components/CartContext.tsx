"use client"; // เพิ่มบรรทัดนี้ที่ด้านบนสุดของไฟล์

import React, { createContext, useContext, useState, ReactNode } from 'react';

// สร้างชนิดข้อมูลสำหรับสินค้าในตะกร้า
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// สร้างชนิดข้อมูลสำหรับ CartContext
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

// สร้าง Context สำหรับ Cart
const CartContext = createContext<CartContextType | undefined>(undefined);

// ฟังก์ชัน useCart สำหรับการใช้ context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart ต้องถูกใช้ภายใน CartProvider");
  }
  return context;
};

// ฟังก์ชัน CartProvider ที่ครอบคลุม context ให้กับ component อื่นๆ
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
