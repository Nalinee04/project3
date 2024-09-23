"use client"; // ใช้ Client Component ใน Next.js 13+

import { useState } from "react";
import { useRouter } from "next/navigation"; // นำเข้า useRouter จาก next/navigation
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

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // เรียกใช้ useRouter
  const router = useRouter();

  // ฟังก์ชันเพื่อจัดการการส่งฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      // ตรวจสอบสถานะของการตอบกลับก่อนที่จะเรียก response.json()
      if (!response.ok) {
        const errorData = await response.json().catch(() => {
          throw new Error('Server did not return JSON');
        });
        throw new Error(errorData.error || 'Registration failed');
      }

      // ถ้าการตอบกลับโอเค ให้แปลงเป็น JSON
      const data = await response.json();
      alert("Registration successful");

      // นำทางไปยังหน้า login
      router.push('/login');

    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>สมัครสมาชิกผู้ใช้</CardTitle>
          <CardDescription>กรุณาสมัครสมาชิกเพื่อเข้าสู่ระบบ</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <p className="mt-2">ชื่อผู้ใช้</p>
            <Input
              type="text"
              placeholder="ชื่อผู้ใช้"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <p className="mt-2">อีเมล</p>
            <Input
              type="email"
              placeholder="อีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="mt-2">รหัสผ่าน</p>
            <Input
              type="password"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="mt-4">
              สมัครสมาชิก
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Link
            className="text-blue-300 underline text-sm hover:text-blue-700"
            href={"/login"}
          >
            มีบัญชีแล้วใช่มั้ย? เข้าสู่ระบบ
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
