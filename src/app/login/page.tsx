"use client"; // เพิ่มเพื่อใช้ Client Component ใน Next.js 13+

import { useState } from "react"; // ใช้ useState เพื่อจัดการสถานะของการแสดง/ซ่อนรหัสผ่าน
import { useRouter } from "next/navigation"; // นำเข้า useRouter เพื่อใช้ในการนำทาง
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image"; // สำหรับแสดงรูปภาพ
import { Eye, EyeOff, Mail, Lock } from "lucide-react"; // นำเข้าไอคอนจากไลบรารี lucide-react

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false); // สถานะการแสดง/ซ่อนรหัสผ่าน
  const [email, setEmail] = useState(""); // สถานะสำหรับอีเมล
  const [password, setPassword] = useState(""); // สถานะสำหรับรหัสผ่าน
  const router = useRouter(); // ใช้ useRouter เพื่อทำการนำทางหลังจากล็อกอินสำเร็จ

  // ฟังก์ชันเพื่อสลับการแสดง/ซ่อนรหัสผ่าน
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // ฟังก์ชันเพื่อจัดการการส่งฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // ตรวจสอบสถานะของการตอบกลับก่อนที่จะเรียก response.json()
      console.log('Response status:', response.status); // ตรวจสอบสถานะของการตอบกลับ
      console.log('Response OK:', response.ok); // ตรวจสอบว่า response.ok เป็น true หรือไม่

      if (!response.ok) {
        let errorMessage = 'Login failed';
        // ตรวจสอบว่า response เป็น JSON ก่อนที่จะเรียก response.json()
        try {
          const errorData = await response.json();
          console.log('Error Data:', errorData); // แสดงข้อมูลของข้อผิดพลาด
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // ถ้าไม่สามารถแปลง response เป็น JSON ได้
          throw new Error('Server did not return JSON');
        }
        throw new Error(errorMessage);
      }

      // ถ้าการตอบกลับโอเค ให้แปลงเป็น JSON
      const data = await response.json();
      console.log('Login Successful Data:', data); // แสดงข้อมูลที่ได้จาก API
      alert("Login successful");

      // นำทางไปยังหน้า home
      router.push('/home'); // เปลี่ยนเส้นทางไปยังหน้า home หลังจากล็อกอินสำเร็จ

    } catch (error) {
      console.log('Error:', error.message); // แสดงข้อผิดพลาดที่เกิดขึ้น
      alert("An error occurred: " + error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-md overflow-hidden flex">
        {/* ส่วนแสดงโลโก้ด้านซ้าย */}
        <div className="w-1/2 p-4 flex justify-center items-center bg-#252525">
          <Image
            src="/images/logo.png" // แก้ไขเป็นเส้นทางของรูปโลโก้ของคุณ
            alt="Shop Logo"
            width={750}
            height={750}
            className="object-contain"
          />
        </div>

        {/* ส่วนฟอร์มล็อกอินด้านขวา */}
        <div className="w-1/2 p-8">
          <Card className="w-full">
            <CardHeader className="flex flex-col items-center">
              <Image
                src="/images/logo food.png" // แก้ไขเป็นเส้นทางของรูปไอคอนผู้ใช้ของคุณ
                alt="User Icon"
                width={80}
                height={80}
                className="mb-4"
              />
              <CardTitle>เข้าสู่ระบบ</CardTitle>
              <CardDescription>กรุณากรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ</CardDescription>
            </CardHeader>
            <CardContent>
              {/* ฟอร์ม */}
              <form onSubmit={handleSubmit}>
                {/* ฟิลด์อีเมล */}
                <div className="relative mt-4">
                  <p className="mb-2">อีเมล</p>
                  <Input
                    type="email"
                    placeholder="อีเมล"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                  <Mail className="absolute left-3 top-9 h-5 w-5 text-gray-400" /> {/* ไอคอนอีเมล */}
                </div>

                {/* ฟิลด์รหัสผ่าน */}
                <div className="relative mt-4">
                  <p className="mb-2">รหัสผ่าน</p>
                  <Input
                    type={showPassword ? "text" : "password"} // เปลี่ยนประเภทของ input ตามสถานะ
                    placeholder="รหัสผ่าน"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <Lock className="absolute left-3 top-9 h-5 w-5 text-gray-400" /> {/* ไอคอนกุญแจ */}
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-9"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" /> // ไอคอนตาถ้ารหัสผ่านแสดงอยู่
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" /> // ไอคอนตาถ้ารหัสผ่านซ่อนอยู่
                    )}
                  </button>
                </div>

                <Button type="submit" className="mt-6 w-full">
                  เข้าสู่ระบบ
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link
                className="text-blue-300 underline text-sm hover:text-blue-700"
                href={"/register"}
              >
                ยังไม่มีบัญชีใช่มั้ย? สมัครสมาชิกเลย
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
