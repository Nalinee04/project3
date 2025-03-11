

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  phone: string;  // ✅ เพิ่มฟิลด์เบอร์โทร
  image: string;
}

// สร้างชนิดข้อมูลสำหรับ UserContext
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null; // เพิ่ม property token
  setToken: (token: string | null) => void; // เพิ่ม property setToken
  login: (userData: User, userToken: string) => void; // เพิ่มฟังก์ชัน login
  logout: () => void; // เพิ่มฟังก์ชัน logout
  updateUser: (updatedUser: User) => void; // เพิ่มฟังก์ชัน updateUser
}

// สร้าง Context สำหรับ User
export const UserContext = createContext<UserContextType | undefined>(undefined);

// ฟังก์ชัน useUser สำหรับการใช้ context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser ต้องถูกใช้ภายใน UserProvider");
  }
  return context;
};

// ฟังก์ชัน UserProvider ที่ครอบคลุม context ให้กับ component อื่นๆ
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); // สร้าง state สำหรับ token

  useEffect(() => {
    // โหลดข้อมูลผู้ใช้และ token จาก localStorage
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  // ฟังก์ชันสำหรับการเข้าสู่ระบบ
  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("user", JSON.stringify(userData)); // ✅ บันทึกเบอร์โทรด้วย
    localStorage.setItem("token", userToken);
  };
  
  // ฟังก์ชันสำหรับการออกจากระบบ
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // ฟังก์ชันสำหรับการอัปเดตข้อมูลผู้ใช้
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser)); // อัปเดตข้อมูลใน localStorage
  };

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
