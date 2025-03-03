"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signIn } from "next-auth/react";

const LoginPage = () => {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progressVisible, setProgressVisible] = useState(false); // State สำหรับแสดง Progress Bar
  const [showRegister, setShowRegister] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isShop, setIsShop] = useState(false);
  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      console.log("🔑 กำลังพยายามเข้าสู่ระบบ...");
      const result = await signIn("credentials", {
        redirect: false,
        phone: phone,
        password: password,
      });
  
      console.log("🔑 ผลลัพธ์จากการล็อกอิน:", result);
  
      if (!result?.ok) {
        throw new Error(result?.error || "เข้าสู่ระบบไม่สำเร็จ");
      }
  
      const res = await fetch("/api/auth/session");
      const session = await res.json();
  
      console.log("🔑 ข้อมูล session ที่ได้รับ:", session);
  
      if (!session?.user) {
        throw new Error("ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
      }
  
      // ✅ บันทึก Token ลง localStorage
      localStorage.setItem("token", session.accessToken);
      console.log("✅ Token ถูกบันทึกลง localStorage:", session.accessToken);
  
      // ตรวจสอบว่าเป็นร้านหรือไม่
      const checkShop = async (phoneNumber: string) => {
        const response = await fetch(`/api/checkShop?phone=${phoneNumber}`);
        const data = await response.json();
        setIsShop(data.isShop);
        console.log("🔑 ร้านคือ: ", data.isShop);
      };
  
      // ตรวจสอบการลงทะเบียน
      const checkRegistration = async (phoneNumber: string) => {
        const response = await fetch(`/api/checkUser?phone=${phoneNumber}`);
        const data = await response.json();
        setIsRegistered(data.exists);
        console.log("🔑 การลงทะเบียน: ", data.exists);
      };
  
      // ตรวจสอบเมื่อกรอกเบอร์โทรศัพท์
      if (phone) {
        await checkShop(phone);
        await checkRegistration(phone);
      }
  
      // แสดงไอคอนหมุนก่อน 2 วินาที
      setTimeout(() => {
        setProgressVisible(true); // แสดง Progress Bar
        console.log("🔑 แสดง Progress Bar");
      }, 2000);
  
      // ไปยังหน้าโฮมหลังจาก 2 วินาที
      setTimeout(() => {
        if (session.user.role === "shop") {
          console.log("🔑 ไปยังหน้า Dashboard ของร้าน");
          router.push("/restaurant/dashboard");
        } else {
          console.log("🔑 ไปยังหน้า Home");
          router.push("/home");
        }
      }, 4500);
    } catch (error: any) {
      toast.error(error.message);
      console.error("🔑 เกิดข้อผิดพลาดในการล็อกอิน: ", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      <ToastContainer position="top-center" autoClose={2500} />

      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-50">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-yellow-600 font-medium">
            กำลังเข้าสู่ระบบ...
          </p>
        </div>
      )}

      {progressVisible && (
        <div className="loading-bar">
          <div className="loading-bar-animation"></div>
        </div>
      )}

      <div className="w-full h-[40vh] bg-yellow-400 flex justify-center items-center">
        <Image
          src="/images/logofoodd.png"
          alt="Logo"
          width={180}
          height={180}
        />
      </div>

      <div className="w-[90%] max-w-md bg-white rounded-2xl shadow-lg p-8 mt-[-40px] relative">
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="text-yellow-400 font-medium">เบอร์โทรศัพท์</label>
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
            <label className="text-yellow-400 font-medium">รหัสผ่าน</label>
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

          <Button
            type="submit"
            className="w-full bg-yellow-100 py-2 rounded-lg shadow-lg hover:bg-yellow-600 transition"
            disabled={loading}
          >
            {loading ? "กำลังโหลด..." : "ลงชื่อเข้าใช้"}
          </Button>
          {/* แสดงปุ่มสมัครสมาชิกถ้าไม่ใช่ร้านและยังไม่ลงทะเบียน */}
          {!isShop && !isRegistered && (
            <Button
              className="w-full border-2 !border-yellow-400 text-gray-600 bg-white py-2 rounded-lg font-medium shadow-md hover:bg-yellow-100 transition mt-6"
              onClick={() => router.push("/register")}
            >
              สมัครสมาชิก
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
