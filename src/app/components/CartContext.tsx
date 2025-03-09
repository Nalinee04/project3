//cartcontext
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ประเภทตัวเลือกของสินค้า
interface OptionSelection {
  group_id: number;
  selected_items: number[];
}

interface CartItem {
  cart_id: string;
  item_id: string;
  menu_name: string;
  price: number;
  quantity: number;
  shop_id: string;
  menu_image: string;
  item_name?: string;
  note?: string;
  options?: OptionSelection[]; // ✅ ใช้ options เท่านั้น
}


interface CartContextType {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addToCart: (item: CartItem) => void;
  removeFromCart: (cart_id: string) => void;
  updateQuantity: (cart_id: string, quantity: number) => void;
  getTotalQuantity: () => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart ต้องถูกใช้ภายใน CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        console.log("✅ โหลดตะกร้าสำเร็จ:", parsedCart);
        setCartItems(parsedCart);
      }
    } catch (error) {
      console.error("❌ โหลดตะกร้าล้มเหลว:", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems)); // ✅ อัปเดต localStorage ทุกครั้งที่ cartItems เปลี่ยน
  }, [cartItems]);

  const generateCartId = (item: CartItem) => {
    const optionsString = item.options
      ? JSON.stringify(
          item.options.map(o => ({
            group_id: o.group_id,
            selected_items: o.selected_items.sort(),
          }))
        )
      : "";
    return `${item.item_id}-${optionsString}-${item.note || ""}`;
  };

  const addToCart = (item: CartItem) => {
    const cart_id = generateCartId(item);

    setCartItems(prevItems => {
      if (prevItems.length > 0 && prevItems[0].shop_id !== item.shop_id) {
        console.log("🛒 ร้านค้าเปลี่ยนจาก", prevItems[0].shop_id, "เป็น", item.shop_id, "ล้างตะกร้า!");
        const newCart = [{ ...item, cart_id }];
        localStorage.setItem("cart", JSON.stringify(newCart)); // ✅ อัปเดต localStorage ทันทีเมื่อร้านค้าเปลี่ยน
        return newCart;
      }

      const existingItem = prevItems.find(cartItem => cartItem.cart_id === cart_id);

      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.cart_id === cart_id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }

      return [...prevItems, { ...item, cart_id }];
    });
  };

  const removeFromCart = (cart_id: string) => {
    setCartItems(prevItems => {
      const updatedCart = prevItems.filter(item => item.cart_id !== cart_id);
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // ✅ อัปเดต localStorage หลังลบสินค้า
      return updatedCart;
    });
  };

  const updateQuantity = (cart_id: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.cart_id === cart_id ? { ...item, quantity } : item
      )
    );
  };

  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, removeFromCart, updateQuantity, getTotalQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
