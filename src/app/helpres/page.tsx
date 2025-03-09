
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ShopHelpPage = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const router = useRouter();

  const handleFinishOnboarding = () => {
    setIsOnboardingCompleted(true);
    router.push("/login"); // นำทางไปหน้าล็อกอินของร้านค้า
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-full max-w-lg px-4">
        {!isOnboardingCompleted ? (
          <Swiper
            spaceBetween={50}
            slidesPerView={1}
            pagination={{ clickable: true, dynamicBullets: true }}
            modules={[Pagination]}
            className="swiper-container"
          >
            {/* Slide 1: เข้าสู่ระบบร้านค้า */}
            <SwiperSlide>
              <div className="flex flex-col items-center text-center py-6">
                <img
                  src="/images/shop-login.gif"
                  alt="Shop Login"
                  className="w-48 mb-4"
                />
                <h2 className="text-3xl font-bold text-yellow-600">
                  เข้าสู่ระบบร้านค้า
                </h2>
                <p className="text-lg text-gray-600">
                  เข้าสู่ระบบเพื่อจัดการร้านค้าของคุณ
                </p>
              </div>
            </SwiperSlide>

            {/* Slide 2: ดูแดชบอร์ดร้านค้า */}
            <SwiperSlide>
              <div className="flex flex-col items-center text-center py-6">
                <img
                  src="/images/dashboard.gif"
                  alt="Dashboard"
                  className="w-48 mb-4"
                />
                <h2 className="text-3xl font-bold text-yellow-600">
                  ดูแดชบอร์ดร้านค้า
                </h2>
                <p className="text-lg text-gray-600">
                  ตรวจสอบยอดขายและออเดอร์ที่รอดำเนินการ
                </p>
              </div>
            </SwiperSlide>

            {/* Slide 3: จัดการออเดอร์ */}
            <SwiperSlide>
              <div className="flex flex-col items-center text-center py-6">
                <img
                  src="/images/order-management.gif"
                  alt="Order Management"
                  className="w-48 mb-4"
                />
                <h2 className="text-3xl font-bold text-yellow-600">
                  จัดการออเดอร์
                </h2>
                <p className="text-lg text-gray-600">
                  อัปเดตสถานะออเดอร์เป็น &quot;เตรียมอาหาร&quot; หรือ
                  &quot;เสร็จแล้ว&quot;
                </p>
              </div>
            </SwiperSlide>

            {/* Slide 4: จัดการเมนู */}
            <SwiperSlide>
              <div className="flex flex-col items-center text-center py-6">
                <img
                  src="/images/menu-management.gif"
                  alt="Menu Management"
                  className="w-48 mb-4"
                />
                <h2 className="text-3xl font-bold text-yellow-600">
                  จัดการเมนูร้าน
                </h2>
                <p className="text-lg text-gray-600">
                  เพิ่ม, แก้ไข หรืออัปเดตเมนูของร้านคุณได้ง่ายๆ
                </p>
              </div>
            </SwiperSlide>

            {/* Slide 5: ตั้งค่าเปิด/ปิดร้านค้า */}
            <SwiperSlide>
              <div className="flex flex-col items-center text-center py-6">
                <img
                  src="/images/shop-status.gif"
                  alt="Shop Status"
                  className="w-48 mb-4"
                />
                <h2 className="text-3xl font-bold text-yellow-600">
                  ตั้งค่าเปิด/ปิดร้านค้า
                </h2>
                <p className="text-lg text-gray-600">
                  เปลี่ยนสถานะร้านค้าได้ตามความสะดวกของคุณ
                </p>
              </div>
            </SwiperSlide>

            {/* Slide 6: ตรวจสอบยอดขาย */}
            <SwiperSlide>
              <div className="flex flex-col items-center text-center py-6">
                <img
                  src="/images/sales-report.gif"
                  alt="Sales Report"
                  className="w-48 mb-4"
                />
                <h2 className="text-3xl font-bold text-yellow-600">
                  ตรวจสอบยอดขาย
                </h2>
                <p className="text-lg text-gray-600">
                  ดูยอดขายรายวันและรายเดือนของร้านคุณ
                </p>
                <button
                  onClick={handleFinishOnboarding}
                  className="bg-yellow-600 text-white py-3 px-8 rounded-full hover:bg-yellow-700 transition text-lg font-semibold shadow-md mt-4"
                >
                  เริ่มต้นใช้งาน
                </button>
              </div>
            </SwiperSlide>
          </Swiper>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-semibold mb-6">เข้าสู่ระบบร้านค้า</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopHelpPage;
