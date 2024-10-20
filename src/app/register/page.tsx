"use client"; 

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { toast } from "@/hooks/use-toast";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitting registration with:', { username, email, password }); // เพิ่มการล็อกที่นี่เพื่อตรวจสอบข้อมูลที่ส่งไป

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: errorData.error,
          description: Date(),
        });
        throw new Error(errorData.error || "Registration failed");
      } else {
        handleOk();
      }

    } catch (error: any) {
      console.error('Error during registration:', error); // แสดงข้อความที่เกิดข้อผิดพลาด
    }
  };

  const handleOk = () => {
    console.log('Registration successful!'); // เพิ่มการล็อกเมื่อสมัครสมาชิกสำเร็จ
    toast({
      title: "Register successfully",
      description: Date(),
    });
    router.push('/login'); // Redirect ไปยังหน้าล็อกอิน
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4" style={{ backgroundColor: '#1E1E1E' }}>
      <div className="w-[1100px] h-[600px] bg-white rounded-lg shadow-md flex">
        
        {/* ฟอร์มลงทะเบียนด้านซ้าย */}
        <div className="w-1/ p-4 flex justify-start items-center">
          <Image
            src="/images/logo.png"
            alt="Shop Logo"
            width={500}
            height={500}
            className="object-contain ml-6"
          />
        </div>

        {/* ฟอร์มลงทะเบียนด้านขวา */}
        <div className="w-1/2 p-2 flex flex-col items-center -ml-4">
          <Image
            src="/images/logo food.png"
            alt="User Icon"
            width={250}
            height={250}
            className="mb-6"
          />

          <form onSubmit={handleSubmit} className="w-full">
            {/* ฟิลด์ชื่อผู้ใช้ */}
            <div className="relative mt-1">
              <FontAwesomeIcon icon={faCircleUser} className="w-[10%] h-[30px] text-gray-500 absolute left-2 top-2.5 ml-6" />
              <input
                type="text"
                placeholder="ชื่อผู้ใช้"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-[90%] h-[50px] pl-14 p-3 border border-gray-300 rounded-lg mb-4 ml-8 text-2xl"
                required
              />
            </div>

            {/* ฟิลด์อีเมล */}
            <div className="relative mt-1">
              <FontAwesomeIcon icon={faEnvelope} className="w-[10%] h-[30px] text-gray-500 absolute left-2 top-2.5 ml-6" />
              <input
                type="email"
                placeholder="อีเมล"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-[90%] h-[50px] pl-14 p-3 border border-gray-300 rounded-lg mb-4 ml-8 text-2xl"
                required
              />
            </div>

            {/* ฟิลด์ password */}
            <div className="relative mt-4">
              <FontAwesomeIcon icon={faLock} className="w-[10%] h-[30px] text-gray-500 absolute left-2 top-2.5 ml-6" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="รหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-14 w-[90%] h-[50px] p-3 border border-gray-300 rounded-lg mb-4 ml-8 text-2xl"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-7 top-3"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>

            <div className="flex justify-center">
              <Button type="submit" className="mt-2 rounded-xl w-[480px] h-[50px] text-2xl -ml-4">
                สมัครสมาชิก
              </Button>
            </div>
          </form>

          <div className="flex justify-center mt-4">
            <span className="text-black text-lg">มีบัญชีอยู่แล้ว?</span>
            <Link
              className="text-blue-500 underline text-lg hover:text-blue-700 ml-2"
              href={"/login"}
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
