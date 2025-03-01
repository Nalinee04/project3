"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FiImage } from "react-icons/fi"; // ไอคอนรูปภาพจาก react-icons

const AddMenu = () => {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession(); // เปลี่ยนชื่อ status เป็น sessionStatus
  const [menuName, setMenuName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState<number>(0);
  const [status, setStatus] = useState<number>(1); // ใช้ status สำหรับสถานะของเมนู
  const [menuImage, setMenuImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMenuImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!menuName || price <= 0 || category <= 0 || !menuImage) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const formData = new FormData();
    formData.append("shop_id", String(session?.user?.shop_id));
    formData.append("menu_name", menuName);
    formData.append("price", String(price));
    formData.append("cate_id", String(category));
    formData.append("status", String(status)); // ส่งสถานะเมนูที่เลือก
    formData.append("menu_image", menuImage);

    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        router.push("/restaurant/menu"); // กลับไปที่หน้าจัดการเมนู
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการเพิ่มเมนู");
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">เพิ่มเมนูใหม่</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700">ชื่อเมนู</label>
          <input
            type="text"
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
            className="w-full p-2 border rounded-md mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">ราคา</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full p-2 border rounded-md mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">หมวดหมู่</label>
          <select
            value={category}
            onChange={(e) => setCategory(Number(e.target.value))}
            className="w-full p-2 border rounded-md mt-1"
            required
          >
            <option value={0}>เลือกหมวดหมู่</option>
            <option value={1}>อาหาร</option>
            <option value={2}>เครื่องดื่ม</option>
            <option value={3}>ของหวาน</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">สถานะ</label>
          <select
            value={status}
            onChange={(e) => setStatus(Number(e.target.value))}
            className="w-full p-2 border rounded-md mt-1"
          >
            <option value={1}>เปิด</option>
            <option value={0}>ปิด</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">รูปภาพเมนู</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full p-2 border rounded-md mt-1"
            required
          />
          <FiImage size={20} className="mt-2" />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" className="bg-yellow-500 text-white py-2 px-4 rounded-md">
          เพิ่มเมนู
        </button>
      </form>
    </div>
  );
};

export default AddMenu;
