
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const HelpPage = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const router = useRouter();

  const handleFinishOnboarding = () => {
    setIsOnboardingCompleted(true);
    router.push('/login'); // นำทางไปหน้าล็อกอิน
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-full max-w-lg px-4">
        {!isOnboardingCompleted ? (
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true, dynamicBullets: true }}
            modules={[Pagination]}
            className="swiper-container"
          >
            {/* Slide 1: เข้าสู่ระบบ */}
            <SwiperSlide>
              <div className="flex flex-col items-center text-center pt-20">
                <img src="/images/login.gif" alt="Login" className="w-56 mb-6" />
                <h2 className="text-3xl font-bold text-yellow-600">เข้าสู่ระบบ</h2>
                <p className="text-lg text-gray-600">เริ่มต้นใช้งานโดยการเข้าสู่ระบบก่อน</p>
              </div>
            </SwiperSlide>

            {/* Slide 2: ค้นหาสินค้า */}
            <SwiperSlide>
              <div className="flex flex-col items-center text-center pt-20">
                <img src="/images/ค้นหา.gif" alt="Search" className="w-56 mb-6" />
                <h2 className="text-3xl font-bold text-yellow-600">ค้นหาสินค้า</h2>
                <p className="text-lg text-gray-600">ใช้ช่องค้นหาเพื่อเลือกสินค้าที่คุณต้องการ</p>
              </div>
            </SwiperSlide>

            {/* Slide 3: เพิ่มสินค้าในตะกร้า */}
            <SwiperSlide>
              <div className="flex flex-col items-center text-center pt-20">
                <img src="/images/ใส่ตะกร้า.gif" alt="Cart" className="w-56 mb-6" />
                <h2 className="text-3xl font-bold text-yellow-600">เพิ่มสินค้าในตะกร้า</h2>
                <p className="text-lg text-gray-600">เลือกสินค้าที่ต้องการและเพิ่มลงในตะกร้าของคุณ</p>
              </div>
            </SwiperSlide>

            {/* Slide 4: ชำระเงินด้วย QR Code */}
            <SwiperSlide>
              <div className="flex flex-col items-center text-center pt-20">
                <img src="/images/QR.gif" alt="Payment" className="w-56 mb-6" />
                <h2 className="text-3xl font-bold text-yellow-600">ชำระเงินด้วย QR Code</h2>
                <p className="text-lg text-gray-600">สแกน QR และแนบสลิปเพื่อยืนยันการชำระเงิน</p>
              </div>
            </SwiperSlide>

            {/* Slide 5: ติดตามคำสั่งซื้อ */}
            <SwiperSlide>
              <div className="flex flex-col items-center text-center pt-20">
                <img src="/images/แจ้งเตือน.gif" alt="Tracking" className="w-56 mb-6" />
                <h2 className="text-3xl font-bold text-yellow-600">ติดตามคำสั่งซื้อ</h2>
                <p className="text-lg text-gray-600">เช็คสถานะออเดอร์ของคุณแบบเรียลไทม์</p>
              </div>
            </SwiperSlide>

            {/* Slide 6: ไปรับของด้วยตนเอง */}
            <SwiperSlide>
              <div className="flex flex-col items-center text-center pt-20">
                <img src="/images/รับสินค้า.gif" alt="Pickup" className="w-56 mb-6" />
                <h2 className="text-3xl font-bold text-yellow-600">ไปรับของด้วยตนเอง</h2>
                <p className="text-lg text-gray-600">รับสินค้าที่ร้านค้าหรือจุดนัดรับตามที่ระบุ</p>
                <button 
                  onClick={handleFinishOnboarding} 
                  className="bg-yellow-600 text-white py-3 px-8 rounded-full hover:bg-yellow-700 transition text-lg font-semibold shadow-md mt-6"
                >
                  เริ่มต้นใช้งาน
                </button>
              </div>
            </SwiperSlide>
          </Swiper>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-semibold mb-6">เข้าสู่ระบบ</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpPage;