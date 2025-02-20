"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMobileScreen,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<{ phone: string; password: string }>({
    phone: "",
    password: "",
  });
  const router = useRouter();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      {/* พื้นหลังสองโทน */}
      <div className="w-full h-[40vh] bg-yellow-400 flex justify-center items-center">
        <Image
          src="/images/logofoodd.png"
          alt="Logo"
          width={180}
          height={180}
        />
      </div>

      {/* กล่องฟอร์ม */}
      <div className="w-[90%] max-w-md bg-white rounded-2xl shadow-lg p-8 mt-[-50px] relative">
        <form>
          {/* เบอร์โทรศัพท์ */}
          <div className="mb-4">
            <label className="flex items-center text-yellow-400 font-medium mb-2">
              <FontAwesomeIcon
                icon={faMobileScreen}
                className="text-yellow-400 mr-2"
              />
              เบอร์โทรศัพท์
            </label>
            <input
              type="tel"
              placeholder="ป้อนเบอร์โทรศัพท์"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full px-4 py-2 border-b-2 border-red-600 outline-none text-gray-600 placeholder-gray-400"
              required
            />
          </div>

          {/* รหัสผ่าน */}
          <div className="mb-4 relative">
            <label className="flex items-center text-yellow-400 font-medium mb-2">
              <FontAwesomeIcon icon={faLock} className="text-yellow-400 mr-2" />
              รหัสผ่าน
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="ป้อนรหัสผ่าน"
                value={password}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border-b-2 border-red-600 focus:border-red-600 outline-none text-gray-600 placeholder-gray-400"
                required
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>

          {/* ปุ่มลงชื่อเข้าใช้ */}
          <Button className="w-full bg-yellow-100 text-neutral-500 font-medium py-2 rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300">
            ลงชื่อ
          </Button>
        </form>

        {/* ปุ่มสมัครสมาชิก */}
        <Button
          className="w-full border-2 !border-yellow-400 text-gray-600 bg-white  text-lg py-2 rounded-lg font-medium shadow-md hover:bg-yellow-100 transition duration-300 mt-6"
          onClick={() => router.push("/register")}
        >
          สมัครสมาชิก
        </Button>
      </div>

      {/* Powered by */}
      <div className="absolute bottom-4 text-xs text-gray-600">
        Powered by Nalinee
      </div>
    </div>
  );
};

export default LoginPage;
