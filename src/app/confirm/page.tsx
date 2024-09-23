"use client"; // เพิ่มบรรทัดนี้ที่ด้านบนสุด

import { useState } from 'react';
import Image from 'next/image';

const ConfirmationPage = () => {
  const [paymentMethod, setPaymentMethod] = useState(''); // สถานะสำหรับการเลือกวิธีชำระเงิน
  const [shippingAddress, setShippingAddress] = useState(''); // สถานะสำหรับที่อยู่จัดส่ง
  
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleShippingAddressChange = (e) => {
    setShippingAddress(e.target.value);
  };

  const handleSubmitOrder = () => {
    // ฟังก์ชันจัดการการส่งคำสั่งซื้อ
    console.log('Order Submitted', { paymentMethod, shippingAddress });
  };

  return (
    <div className="container mx-auto p-4">
      {/* ส่วนหัว */}
      <header className="flex justify-between items-center py-4 border-b mb-8">
        <h1 className="text-2xl font-bold">Thai Food</h1>
        <nav>
          <ul className="flex space-x-4">
          </ul>
        </nav>
      </header>

      {/* หน้าหลักของยืนยันคำสั่งซื้อ */}
      <div className="p-4 bg-white rounded-lg shadow-lg">
        {/* ส่วนที่อยู่จัดส่ง */}
        <div className="border-b pb-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">เลือกที่อยู่จัดส่ง</h2>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image src="/location-icon.png" alt="Address" width={50} height={50} />
              <div className="ml-4">
                <p>รายละเอียดที่อยู่จัดส่ง</p>
                <p>{shippingAddress || 'กรุณาเลือกที่อยู่จัดส่ง'}</p>
              </div>
            </div>
            <button className="text-blue-500 underline" onClick={() => setShippingAddress('ที่อยู่ใหม่')}>
              เปลี่ยนที่อยู่จัดส่ง
            </button>
          </div>
        </div>

        {/* รายการสินค้า */}
        <div className="border-b pb-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">รายการสินค้า</h2>
          <div className="flex justify-between items-center mb-2">
            <p>ชื่อสินค้า</p>
            <div className="flex space-x-4">
              <input type="number" min="1" defaultValue="1" className="w-16 border px-2 py-1" />
              <button className="text-red-500">ลบ</button>
            </div>
            <p>ราคา</p>
          </div>
        </div>

        {/* วิธีการชำระเงิน */}
        <div className="border-b pb-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">ช่องทางการชำระเงิน</h2>
          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
                name="payment"
                value="โอนเงิน"
                checked={paymentMethod === 'โอนเงิน'}
                onChange={handlePaymentMethodChange}
              />
              โอนเงิน
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="เก็บเงินปลายทาง"
                checked={paymentMethod === 'เก็บเงินปลายทาง'}
                onChange={handlePaymentMethodChange}
              />
              เก็บเงินปลายทาง
            </label>
          </div>
        </div>

        {/* ส่วนฟุตเตอร์รวมราคาและปุ่มยืนยัน */}
        <div className="text-center">
          <button
            onClick={handleSubmitOrder}
            className="bg-black text-white py-2 px-4 mt-4 rounded-lg hover:bg-gray-800"
          >
            ยืนยันคำสั่งซื้อ
          </button>
        </div>
      </div>

      {/* ส่วนฟุตเตอร์ */}
      <footer className="mt-8 border-t pt-4 text-center">
        <p>© 2023 Company Name. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#">About Us</a>
          <a href="#">Contact</a>
          <a href="#">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
};

export default ConfirmationPage;
