// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { toast } from "@/hooks/use-toast";
import { useUser } from "../components/Usercontext";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setUser, setToken } = useUser();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Logging in with:", identifier, password);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      console.log("Login response data:", data);

      // เก็บข้อมูลผู้ใช้และ token ใน context
      setUser(data.user); // เก็บข้อมูลผู้ใช้ใน context
      setToken(data.token); // เก็บ JWT token ใน context

      // เก็บ JWT token ใน localStorage
      localStorage.setItem("user", JSON.stringify(data.user)); // เก็บข้อมูลผู้ใช้
      localStorage.setItem("token", data.token); // เก็บ JWT token

      toast({
        title: "Login successfully",
        description: "คุณเข้าสู่ระบบเรียบร้อยแล้ว",
      });
      router.push("/home"); // เปลี่ยนเส้นทางไปยังหน้า home
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login error:", error.message);
        toast({
          title: "Login failed",
          description: error.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
        });
      } else {
        console.error("Unexpected error:", error);
        toast({
          title: "Login failed",
          description: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
        });
      }
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen p-4"
      style={{ backgroundColor: "#1E1E1E" }}
    >
      <div className="w-[1100px] h-[600px] bg-white rounded-lg shadow-md flex">
        {/* ฟอร์มล็อกอินด้านซ้าย */}
        <div className="w-1/2 p-4 flex justify-start items-center">
          <Image
            src="/images/logo.png"
            alt="Shop Logo"
            width={500}
            height={500}
            className="object-contain ml-6"
          />
        </div>

        {/* ฟอร์มล็อกอินด้านขวา */}
        <div className="w-1/2 p-2 flex flex-col items-center -ml-4">
          <Image
            src="/images/logo food.png"
            alt="User Icon"
            width={250}
            height={250}
            className="mb-6"
          />

          <form onSubmit={handleSubmit} className="w-full">
            {/* ฟิลด์สำหรับกรอกชื่อผู้ใช้หรืออีเมล */}
            <div className="relative mt-1">
              <FontAwesomeIcon
                icon={faCircleUser}
                className="w-[10%] h-[30px] text-gray-500 absolute left-2 top-2.5 ml-6"
              />
              <input
                type="text"
                placeholder="Username or Email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-[90%] h-[50px] pl-14 p-3 border border-gray-300 rounded-lg mb-4 ml-8 text-2xl"
              />
            </div>

            {/* ฟิลด์รหัสผ่าน */}
            <div className="relative mt-4">
              <FontAwesomeIcon
                icon={faLock}
                className="w-[10%] h-[30px] text-gray-500 absolute left-2 top-2.5 ml-6"
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-14 w-[90%] h-[50px] p-3 border border-gray-300 rounded-lg mb-4 ml-8 text-2xl"
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
              <Button
                type="submit"
                className="mt-9  rounded-xl w-[480px] h-[50px] text-2xl -ml-4"
              >
                เข้าสู่ระบบ
              </Button>
            </div>
          </form>

          {/* ลิงค์สำหรับรีเซ็ตรหัสผ่าน */}
          <Link
            href="/forgotpassword"
            className="text-red-500 underline text-lg hover:text-red-700 mt-4"
          >
            ลืมรหัสผ่าน?
          </Link>

          <div className="flex justify-center mt-4">
            <span className="text-black text-lg">ยังไม่มีบัญชีใช่มั้ย?</span>
            <Link
              className="text-blue-500 underline text-lg hover:text-blue-700 ml-2"
              href={"/register"}
            >
              สมัครสมาชิกเลย
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
