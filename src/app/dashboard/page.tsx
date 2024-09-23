"use client"; // เพื่อใช้ Client Component

import React, { useState } from 'react'; // นำเข้า useState เพื่อจัดการสถานะ
import { useRouter } from 'next/navigation'; // สำหรับการนำทางหลังจากเข้าสู่ระบบ
import Image from 'next/image'; // สำหรับแสดงรูปภาพ
import { ShoppingCart } from 'lucide-react'; // นำเข้าไอคอน Cart จาก lucide-react
import AddProductPage from '@/app/AddProduct/page'; // นำเข้าหน้า AddProduct ที่คุณสร้างไว้

const DashboardPage = () => {
  const router = useRouter(); // ใช้ useRouter สำหรับการนำทาง
  const [content, setContent] = useState('dashboard'); // สถานะเพื่อจัดการคอนเทนต์ที่จะแสดง

  // ฟังก์ชันเพื่อออกจากระบบ
  const handleLogout = () => {
    router.push('/login'); // นำทางกลับไปที่หน้า login
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <div className="mb-8 flex justify-center">
          {/* ปรับแต่งให้โลโก้เป็นวงกลม */}
          <div className="w-32 h-32 rounded-full overflow-hidden bg-white flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={150}
              height={150}
              className="object-cover"
            />
          </div>
        </div>
        <ul className="space-y-4">
          <li className="flex items-center gap-2 cursor-pointer" onClick={() => setContent('dashboard')}>
            <span>🏠</span>
            <span>หน้าหลัก</span>
          </li>
          <li className="flex items-center gap-2 cursor-pointer" onClick={() => setContent('addProduct')}>
            <span>🍴</span>
            <span>จัดการเมนู</span>
          </li>
          <li className="flex items-center gap-2 cursor-pointer" onClick={() => setContent('report')}>
            <span>📄</span>
            <span>รายงาน</span>
          </li>
          <li className="flex items-center gap-2 cursor-pointer" onClick={handleLogout}>
            <span>🔧</span>
            <span>ออกจากระบบ</span>
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="w-full p-4">
        {/* Render different content based on state */}
        {content === 'dashboard' && (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <div className="flex items-center gap-4">
                <span>Admin</span>
                <button
                  onClick={handleLogout}
                                   className="bg-red-500 text-white py-2 px-4 rounded-lg" // เพิ่ม rounded-lg
                >
                  ออกจากระบบ
                </button>
              </div>
            </div>

            {/* Dashboard Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-8"> {/* ปรับ grid-cols-4 สำหรับ 4 การ์ดต่อแถว */}
              {/* Card Components */}
              {Array(8).fill().map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow text-center min-w-[200px] min-h-[150px]"> {/* เพิ่ม rounded-lg */}
                  <ShoppingCart className="mx-auto mb-2 h-8 w-8 text-gray-500" /> {/* เพิ่มไอคอน Cart */}
                  <h2 className="font-bold">ออเดอร์ {i + 1}</h2>
                  <p>จำนวน</p>
                </div>
              ))}
            </div>

            {/* Order Table */}
            <div className="bg-white p-4 rounded-lg shadow"> {/* เพิ่ม rounded-lg */}
              <h2 className="font-bold mb-4">คำสั่งซื้อ</h2>
              
              {/* Filter and Search */}
              <div className="flex items-center mb-4">
                {/* Status Dropdown */}
                <select className="border p-2 mr-2 rounded">
                  <option>สถานะ</option>
                  <option>กำลังดำเนินการ</option>
                  <option>เสร็จสมบูรณ์</option>
                  <option>ยกเลิก</option>
                </select>
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="ค้นหา"
                  className="border p-2 rounded flex-1"
                />
                {/* Search Button */}
                <button className="ml-2 p-2 rounded bg-gray-200">
                  🔍
                </button>
              </div>
              
              <table className="w-full rounded-lg overflow-hidden"> {/* เพิ่ม rounded-lg */}
                <thead>
                  <tr className="border-b">
                    <th className="py-2">
                      <input type="checkbox" />
                    </th>
                    <th className="py-2">Task</th>
                    <th className="py-2">ชื่อลูกค้า</th>
                    <th className="py-2">สินค้า</th>
                    <th className="py-2">จำนวน</th>
                    <th className="py-2">สถานะ</th>
                    <th className="py-2">เวลาที่ออเดอร์เข้า</th>
                    <th className="py-2">เวลาที่ออเดอร์เสร็จ</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mock Data */}
                  {Array(10).fill().map((_, i) => (
                    <tr key={i}>
                      <td className="py-2 text-center">
                        <input type="checkbox" />
                      </td>
                      <td className="py-2">Task-ordernumber-{i + 1}</td>
                      <td className="py-2">User-{i + 1}</td>
                      <td className="py-2">Product Name</td>
                      <td className="py-2 text-center">1</td>
                      <td className="py-2 text-center">
                        <button className="p-1 rounded bg-gray-200">+ Status</button>
                      </td>
                      <td className="py-2 text-center">Date/Time</td>
                      <td className="py-2 text-center">Date/Time</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center">
                  <button className="p-2 rounded">{"<<"}</button>
                  <button className="p-2 rounded">{"<"}</button>
                  <span className="mx-2">1</span>
                  <button className="p-2 rounded">{">"}</button>
                  <button className="p-2 rounded">{">>"}</button>
                </div>
                <div>
                  <select className="border p-2 rounded">
                    <option>5</option>
                    <option>10</option>
                    <option>20</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}
        
        {content === 'addProduct' && (
          <AddProductPage />
        )}

        {content === 'report' && (
          <div>
            <h1 className="text-2xl font-bold">Report</h1>
            {/* แสดงคอนเทนต์ของ Report */}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;