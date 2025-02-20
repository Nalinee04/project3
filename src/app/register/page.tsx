"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMobileScreen } from "@fortawesome/free-solid-svg-icons";

const RegisterPage = () => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState(""); // รหัสผ่าน
  const [confirmPassword, setConfirmPassword] = useState(""); // ยืนยันรหัสผ่าน
  const [error, setError] = useState(""); // error message state
  const [formValid, setFormValid] = useState(true); // to check if the form is valid
  const router = useRouter();

  // ตรวจสอบชื่อห้ามมีตัวเลข
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/[^a-zA-Z\u0E00-\u0E7F ]/.test(value)) {  // Allow only letters (English/Thai)
      setError("ชื่อห้ามมีตัวเลข");
      setFormValid(false);
    } else {
      setError("");
      setName(value);
      setFormValid(true);
    }
  };

  // ตรวจสอบเบอร์โทรศัพท์ให้เป็นตัวเลข 10 หลัก
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^\d{0,10}$/.test(value)) {  // Allow only numbers, max 10 digits
      setError("เบอร์โทรศัพท์ต้องเป็นตัวเลขและมี 10 หลัก");
      setFormValid(false);
    } else {
      setError("");
      setPhone(value);
      setFormValid(true);
    }
  };

  // ตรวจสอบรหัสผ่าน
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (value !== confirmPassword) {
      setError("รหัสผ่านและยืนยันรหัสผ่านต้องตรงกัน");
      setFormValid(false);
    } else {
      setError("");
      setFormValid(true);
    }
  };

  // ตรวจสอบยืนยันรหัสผ่าน
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value !== password) {
      setError("รหัสผ่านและยืนยันรหัสผ่านต้องตรงกัน");
      setFormValid(false);
    } else {
      setError("");
      setFormValid(true);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check for form validity before submitting
    if (!formValid || !phone || !name || !password || !confirmPassword) {
      toast({ title: "กรุณากรอกข้อมูลให้ครบถ้วน", description: error });
      return;
    }

    // ส่งข้อมูลไปที่ API สำหรับสมัครสมาชิก
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, name, password }), // ไม่ต้องส่ง confirmPassword
    });

    const data = await response.json();

    if (data.message) {
      toast({ title: "สมัครสมาชิกสำเร็จ", description: "ยินดีต้อนรับเข้าสู่ระบบ!" });
      router.push("/login"); // ไปที่หน้า login หรือหน้าอื่นๆ
    } else if (data.error) {
      toast({ title: "Error", description: data.error });
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-yellow-400 pt-16">
      {/* Logo */}
      <div className="mb-6 mt-0">
        <Image src="/images/logofoodd.png" alt="Logo" width={150} height={150} />
      </div>

      {/* Form Card */}
      <div className="w-[90%] max-w-md bg-white rounded-lg shadow-lg p-6 mt-6">
        {/* Title - สมัครสมาชิก */}
        <h1 className="text-2xl font-bold text-center mb-0">สมัครสมาชิก</h1>

        <form onSubmit={handleRegister}>
          <label className="flex items-center text-black font-medium mb-1">
            <FontAwesomeIcon icon={faMobileScreen} className="text-black mr-2" />
            เบอร์โทรศัพท์
          </label>
          <input
            type="tel"
            placeholder="ป้อนเบอร์โทรศัพท์"
            value={phone}
            onChange={handlePhoneChange}
            className={`w-full px-4 py-2 border-b-2 ${error && !formValid ? 'border-red-500' : 'border-gray-500'} focus:outline-none`}
            required
          />

          <label className="flex items-center text-black font-medium mb-1 mt-4">
            ชื่อ
          </label>
          <input
            type="text"
            placeholder="ป้อนชื่อ"
            value={name}
            onChange={handleNameChange}
            className={`w-full px-4 py-2 border-b-2 ${error && !formValid ? 'border-red-500' : 'border-gray-500'} focus:outline-none`}
            required
          />

          <label className="flex items-center text-black font-medium mb-1 mt-4">
            รหัสผ่าน
          </label>
          <input
            type="password"
            placeholder="ป้อนรหัสผ่าน"
            value={password}
            onChange={handlePasswordChange}
            className={`w-full px-4 py-2 border-b-2 ${error && !formValid ? 'border-red-500' : 'border-gray-500'} focus:outline-none`}
            required
          />

          <label className="flex items-center text-black font-medium mb-1 mt-4">
            ยืนยันรหัสผ่าน
          </label>
          <input
            type="password"
            placeholder="ยืนยันรหัสผ่าน"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className={`w-full px-4 py-2 border-b-2 ${error && !formValid ? 'border-red-500' : 'border-gray-500'} focus:outline-none`}
            required
          />

          {/* Show error message */}
          {error && !formValid && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <Button type="submit" className="w-full bg-yellow-200 text-black mt-8 py-2 rounded-lg" disabled={!formValid}>
            สมัครสมาชิก
          </Button>
        </form>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-xs text-gray-600 mb-7">
        Powered by Nalinee
      </div>
    </div>
  );
};

export default RegisterPage;
