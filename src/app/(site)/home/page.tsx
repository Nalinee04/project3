"use client"; // เพิ่มบรรทัดนี้เพื่อทำให้คอมโพเนนต์เป็น Client Component

import React, { useState } from 'react'; // นำเข้า React และ useState
import Content from "../../components/Content";

import PaginationPage from "../../components/Pagination";

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState(1); // สร้าง state สำหรับหน้าปัจจุบัน
  const productsPerPage = 8; // จำนวนสินค้าต่อหน้า
  const totalProducts = 30; // จำนวนสินค้าทั้งหมด
  const totalPages = Math.ceil(totalProducts / productsPerPage); // คำนวณจำนวนหน้าทั้งหมด

  // ฟังก์ชันสำหรับเปลี่ยนหน้า
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Content />
    
     
    </>
  );
};

export default HomePage;
