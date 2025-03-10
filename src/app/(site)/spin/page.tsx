"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const SpinPage = ({ userId }: { userId: string }) => {
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rounds, setRounds] = useState<number>(1); // จำนวนรอบการหมุน
  const [spinAngle, setSpinAngle] = useState(0); // ใช้ในการหมุนวงล้อ
  const [showPopup, setShowPopup] = useState(false); // ใช้สำหรับแสดง/ซ่อน Popup
  const [spinData, setSpinData] = useState<any>(null); // ข้อมูลสิทธิ์การหมุน
  const [menus, setMenus] = useState<any[]>([]); // เมนูทั้งหมดที่สามารถหมุนได้

  useEffect(() => {
    // ดึงข้อมูลสิทธิ์การหมุนจาก API
    const fetchSpinData = async () => {
      try {
        const res = await fetch(`/api/spin/${userId}`);
        const data = await res.json();
        if (res.ok) {
          setSpinData(data);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error fetching spin data:", error);
      }
    };

    // ดึงเมนูทั้งหมดจาก API
    const fetchMenus = async () => {
      try {
        const res = await fetch("/api/menus");
        const data = await res.json();
        if (res.ok) {
          setMenus(data.menus);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    };

    fetchSpinData();
    fetchMenus();
  }, [userId]);

  // ฟังก์ชันหมุนวงล้อ
  const spinWheel = async () => {
    if (spinData.used_spins_today >= 5) {
      alert("You've reached your daily spin limit.");
      return;
    }

    setIsSpinning(true);
    let angle = 0;
    let spins = rounds * 360 + Math.floor(Math.random() * 360); // หมุนรอบละ 360 องศา

    const spinInterval = setInterval(() => {
      angle += 15; // หมุนทุกๆ 15 องศา
      setSpinAngle(angle);
    }, 20); // อัพเดตการหมุนทุก 20ms

    // หลังจากครบจำนวนรอบที่กำหนด
    setTimeout(async () => {
      clearInterval(spinInterval);

      // สุ่มเมนูที่ได้จากเมนูทั้งหมด
      const randomMenu = menus[Math.floor(Math.random() * menus.length)];

      // บันทึกประวัติการหมุน
      const res = await fetch(`/api/spin/${userId}/spin`, {
        method: "POST",
        body: JSON.stringify({
          menu_id: randomMenu.menu_id,
          is_secret: randomMenu.is_secret,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (res.ok) {
        setSpinResult(data.menu.name);
      } else {
        console.error(data.error);
      }

      setIsSpinning(false);
      setShowPopup(true); // แสดง Popup เมื่อการหมุนเสร็จ
    }, spins * 20);
  };

  // ฟังก์ชันสำหรับการตั้งค่าจำนวนรอบ
  const handleRoundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRounds(Number(e.target.value));
  };

  // ฟังก์ชันสำหรับปิด Popup
  const closePopup = () => {
    setShowPopup(false);
    setSpinResult(null); // รีเซ็ตผลลัพธ์เมื่อปิด Popup
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-xl font-semibold mb-4">Spin to Get a Free Menu!</h1>

      {/* ช่องระบุจำนวนรอบการหมุน */}
      <div className="mb-6">
        <label className="text-sm">Number of Spins:</label>
        <input
          type="number"
          value={rounds}
          onChange={handleRoundsChange}
          min="1"
          max="10"
          className="mt-2 p-2 border rounded-lg"
        />
      </div>

      {/* ปุ่มหมุนวงล้อ */}
      <button
        onClick={spinWheel}
        disabled={isSpinning}
        className={`px-6 py-2 bg-blue-500 text-white rounded-lg ${isSpinning ? "opacity-50" : ""}`}
      >
        {isSpinning ? "Spinning..." : "Spin the Wheel!"}
      </button>

      {/* Popup แสดงผลลัพธ์ */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <h2 className="text-xl font-semibold">Congratulations!</h2>
            <p className="text-lg text-green-600 font-bold mt-4">
              You won: {spinResult}
            </p>

            {/* วงล้อหมุน */}
            <div className="relative mb-6 w-64 h-64">
              {/* วงล้อ */}
              <div
                className={`absolute w-full h-full bg-gray-200 rounded-full transition-transform duration-500`}
                style={{
                  transform: `rotate(${spinAngle}deg)`,
                }}
              >
                {/* เพิ่มลูกศรตรงกลาง */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 bg-red-500 transform rotate-45 rounded-full"></div>
                </div>

                {/* วงล้อที่แบ่งเป็นส่วนๆ */}
                {menus.map((item, index) => {
                  const angle = (360 / menus.length) * index; // คำนวณองศา
                  return (
                    <div
                      key={index}
                      className="absolute w-full h-full flex justify-center items-center"
                      style={{
                        transform: `rotate(${angle}deg) translateY(-50%)`,
                        transformOrigin: "0% 100%",
                      }}
                    >
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-8 bg-white shadow-md rounded-lg flex justify-center items-center">
                        <p className="text-sm">{item.menu_name}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ปุ่มปิด Popup */}
            <button
              onClick={closePopup}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinPage;
