"use client"; // ✅ ใช้ client component

import { createContext, useContext, useState } from "react";

// 🔹 กำหนดประเภทของ Context
interface CategoryContextType {
  selectedCategory: number | null;
  setSelectedCategory: (category: number | null) => void; // ✅ เปลี่ยนชื่อให้ตรงกับ state จริง
  isCategorySelected: boolean;
  setIsCategorySelected: (value: boolean) => void;
}

// 🔹 สร้าง Context (ค่าเริ่มต้น)
const CategoryContext = createContext<CategoryContextType>({
  selectedCategory: null, 
  setSelectedCategory: () => {}, // ✅ แก้ชื่อจาก `setCategory` เป็น `setSelectedCategory`
  isCategorySelected: false,
  setIsCategorySelected: () => {},
});

// 🔹 Provider ห่อ Component ที่ต้องการใช้ Context
export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isCategorySelected, setIsCategorySelected] = useState(false);

  return (
    <CategoryContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory, // ✅ ใช้ `setSelectedCategory` แทน `setCategory`
        isCategorySelected,
        setIsCategorySelected,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

// 🔹 Hook ใช้ดึงค่าไปใช้ในคอมโพเนนต์อื่น ๆ
export function useCategory() {
  return useContext(CategoryContext);
}
