"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMobileScreen,
  faUser,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterPage = () => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("❌ รหัสผ่านไม่ตรงกัน!", {
        autoClose: 2500,
        theme: "colored",
        pauseOnHover: true,
        closeOnClick: true,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "สมัครสมาชิกไม่สำเร็จ");
      }

      toast.success("✅ สมัครสมาชิกสำเร็จ! กำลังไปยังหน้าเข้าสู่ระบบ...", {
        autoClose: 2500,
        theme: "colored",
        pauseOnHover: true,
        closeOnClick: true,
      });

      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (error: any) {
      toast.error(error.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก", {
        autoClose: 2500,
        theme: "colored",
        pauseOnHover: true,
        closeOnClick: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      <ToastContainer position="top-center" autoClose={2500} />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-yellow-500 font-semibold">กำลังสมัครสมาชิก...</p>
          </div>
        </div>
      )}

      <div className="w-full h-[35vh] bg-yellow-400 flex justify-center items-center">
        <Image src="/images/logofoodd.png" alt="Logo" width={180} height={180} />
      </div>

      <div className="w-[90%] max-w-md bg-white rounded-2xl shadow-lg p-8 mt-[-60px] relative">
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="flex items-center text-yellow-400 font-medium mb-2">
              <FontAwesomeIcon icon={faUser} className="text-yellow-400 mr-2" /> ชื่อ
            </label>
            <input
              type="text"
              placeholder="ป้อนชื่อ"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border-b-2 border-red-600 outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center text-yellow-400 font-medium mb-2">
              <FontAwesomeIcon icon={faMobileScreen} className="text-yellow-400 mr-2" /> เบอร์โทรศัพท์
            </label>
            <input
              type="tel"
              placeholder="ป้อนเบอร์โทรศัพท์"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border-b-2 border-red-600 outline-none"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label className="flex items-center text-yellow-400 font-medium mb-2">
              <FontAwesomeIcon icon={faLock} className="text-yellow-400 mr-2" /> รหัสผ่าน
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="ป้อนรหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border-b-2 border-red-600 outline-none"
                required
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>
          <div className="mb-4 relative">
            <label className="flex items-center text-yellow-400 font-medium mb-2">
              <FontAwesomeIcon icon={faLock} className="text-yellow-400 mr-2" /> ยืนยันรหัสผ่าน
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="ยืนยันรหัสผ่าน"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border-b-2 border-red-600 outline-none"
                required
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-yellow-100 py-2 rounded-lg shadow-lg hover:bg-yellow-600 transition">
            สมัครสมาชิก
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
