

import React, { useState, useEffect } from "react";

interface WaitingTimeProps {
  orderTime: Date; // เปลี่ยนประเภทเป็น Date
  status: string; // รับสถานะออเดอร์
}


const WaitingTime: React.FC<WaitingTimeProps> = ({ orderTime, status }) => {
  const [waitingTime, setWaitingTime] = useState<string>("");

  const calculateWaitingTime = (orderTime: Date): string => {
    if (isNaN(orderTime.getTime())) {
      return "ไม่ทราบเวลาที่รอ"; // แสดงข้อความเมื่อไม่สามารถแปลงเป็นวันที่ได้
    }
    const now = new Date();
    const waitingTimeInMs = now.getTime() - orderTime.getTime();
  
    // คำนวณเวลาเป็นชั่วโมง, นาที, วินาที
    const seconds = Math.floor((waitingTimeInMs / 1000) % 60);
    const minutes = Math.floor((waitingTimeInMs / (1000 * 60)) % 60);
    const hours = Math.floor((waitingTimeInMs / (1000 * 60 * 60)) % 24);
  
    // ฟอร์แมตเวลาที่แสดง
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
  

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (status !== "จัดส่งแล้ว") {
        setWaitingTime(calculateWaitingTime(orderTime));
      }
    }, 1000); // อัปเดตทุก 1 วินาที

    // เรียกใช้ฟังก์ชันแรกเพื่อแสดงค่าเริ่มต้น
    if (status !== "จัดส่งแล้ว") {
      setWaitingTime(calculateWaitingTime(orderTime));
    }

    return () => clearInterval(intervalId); // เคลียร์ interval เมื่อคอมโพเนนต์ถูกยกเลิก
  }, [orderTime, status]);

  // ตั้งค่าสีตามสถานะ
  const textColor = status === "จัดส่งแล้ว" ? 'green' : 'red';

  return (
    <span style={{ color: textColor }}>
      {status === "จัดส่งแล้ว" ? "จัดส่งแล้ว" : waitingTime}
    </span>
  ); // แสดงผลเวลาที่รอเป็นสีตามสถานะ
};

export default WaitingTime;
