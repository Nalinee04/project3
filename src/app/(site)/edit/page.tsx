//app /edit
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { User, Phone, Lock } from "lucide-react";
import Image from "next/image";
import { ArrowLeft, Camera, Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react";

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    phone: "",
    password: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/edit", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(<><XCircle size={20} className="inline-block mr-2" /> โหลดข้อมูลไม่สำเร็จ</>);
        } else {
          setUser(data);
        }
        setLoading(false);
      })
      .catch(() => {
        toast.error(<><XCircle size={20} className="inline-block mr-2" /> ไม่สามารถโหลดข้อมูลได้</>);
        setLoading(false);
      });
  }, []);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);

    const token = localStorage.getItem("token");

    const res = await fetch("/api/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: user.name,
        phone: user.phone,
        password: user.password,
        image: user.image,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success(<><CheckCircle size={20} className="inline-block mr-2" /> อัปเดตข้อมูลสำเร็จ</>);
      setTimeout(() => router.push("/home"), 2000);
    } else {
      toast.error(<><XCircle size={20} className="inline-block mr-2" /> {data.error}</>);
    }

    setUpdating(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      <ToastContainer position="top-center" autoClose={2500} hideProgressBar />
      {updating && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-50">
          <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
          <p className="mt-2 text-yellow-400 font-medium">กำลังอัปเดต...</p>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          แก้ไขข้อมูลบัญชี
        </h1>

        {/* รูปโปรไฟล์ */}
        <div className="flex justify-center mt-4 relative">
          <label className="relative cursor-pointer">
            <Image
              key={user.image}
              src={user.image ? user.image : "/images/userr.png"}
              alt="Profile"
              width={96}
              height={96}
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-300 shadow-md"
            />

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("file", file);

                fetch("/api/upload", {
                  method: "POST",
                  body: formData,
                })
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.path) {
                      setUser((prev) => ({ ...prev, image: data.path }));
                    } else {
                      toast.error(<><XCircle size={20} className="inline-block mr-2" /> อัปโหลดรูปไม่สำเร็จ</>);
                    }
                  })
                  .catch(() => {
                    toast.error(<><XCircle size={20} className="inline-block mr-2" /> เกิดข้อผิดพลาดในการอัปโหลด</>);
                  });
              }}
            />
            <Camera
              className="absolute bottom-1 right-1 bg-gray-200 p-1 rounded-full shadow-md"
              size={20}
            />
          </label>
        </div>

        {/* ฟอร์มแก้ไขข้อมูล */}
        <form onSubmit={handleUpdate} className="mt-6 space-y-6">
          <div>
            <label className="block text-gray-600 font-medium">ชื่อ</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg outline-none shadow-sm focus:ring-2 focus:ring-blue-400"
              value={user.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUser({ ...user, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium">เบอร์โทร</label>
            <input
              type="tel"
              className="w-full px-4 py-2 border rounded-lg outline-none shadow-sm focus:ring-2 focus:ring-blue-400"
              value={user.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUser({ ...user, phone: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium">
              รหัสผ่าน (ถ้าต้องการเปลี่ยน)
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 border rounded-lg outline-none shadow-sm focus:ring-2 focus:ring-blue-400"
                placeholder="เว้นว่างไว้ถ้าไม่ต้องการเปลี่ยน"
                value={user.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUser({ ...user, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute right-3 top-2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-yellow-500 py-2 text-white font-bold rounded-lg hover:bg-yellow-600 transition flex justify-center items-center"
            disabled={updating}
          >
            {updating ? <Loader2 size={20} className="animate-spin mr-2" /> : null}
            บันทึกการเปลี่ยนแปลง
          </Button>
        </form>
      </div>
    </div>
  );
}
