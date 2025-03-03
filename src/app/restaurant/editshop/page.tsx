"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft} from "lucide-react";
import Swal from "sweetalert2"; // นำเข้า SweetAlert2
import { Button } from "@/components/ui/button";
import {
  Camera,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function EditShopPage() {
  const router = useRouter();
  const [shopData, setShopData] = useState({
    shop_name: "",
    phone_number: "",
    password: "",
    shop_image: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("ไม่พบข้อมูลผู้ใช้");
        router.push("/login");
        return;
      }
      await fetchShopData(token);
    };
    getToken();
  }, []);

  const fetchShopData = async (token: string | null) => {
    if (!token) {
      console.error("❌ Token ไม่ถูกต้อง");
      return;
    }

    try {
      const res = await fetch("/api/editshop", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("📩 API Response:", data);

      if (data.error) {
        console.error("❌ API Error:", data.error);
        toast.error(
          <>
            <XCircle size={20} className="inline-block mr-2" /> {data.error}
          </>
        );

        if (data.error === "Token is invalid or expired") {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } else {
        console.log("✅ ตั้งค่าข้อมูลร้าน:", data);
        setShopData(data);
      }
    } catch (error) {
      console.error("🚨 Fetch Error:", error);
      toast.error(
        <>
          <XCircle size={20} className="inline-block mr-2" />{" "}
          ไม่สามารถโหลดข้อมูลได้
        </>
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);
    const token = localStorage.getItem("token");
  
    try {
      const res = await fetch("/api/editshop", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(shopData),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        Swal.fire({
          title: "อัปเดตสำเร็จ!",
          text: "ข้อมูลร้านถูกบันทึกแล้ว",
          icon: "success",
          draggable: true,
          confirmButtonText: "ตกลง",
        }).then(() => {
          router.push("/restaurant/dashboard");
        });
      } else {
        toast.error(data.error);
        if (data.error === "Token is invalid or expired") {
          localStorage.removeItem("token");
          router.push("/login");
        }
      }
    } catch (error) {
      toast.error("ไม่สามารถอัปเดตข้อมูลได้");
    } finally {
      setUpdating(false);
    }
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

         {/* Header */}
         <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 relative">
        <button
          className="absolute left-4 top-4 text-gray-600 hover:text-gray-800"
          onClick={() => router.back()}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          แก้ไขข้อมูลร้าน
        </h1>

        
        {shopData.shop_image && (
          <div className="flex justify-center mt-4">
            <img
              src={
                shopData.shop_image.startsWith("http")
                  ? shopData.shop_image
                  : `http://localhost:3000${shopData.shop_image}`
              }
              alt="Shop Image"
              className="w-32 h-32 rounded-lg object-cover border"
            />
          </div>
        )}
        <form onSubmit={handleUpdate} className="mt-6 space-y-6">
          <div>
            <label className="block text-gray-600 font-medium">ชื่อร้าน</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg outline-none shadow-sm focus:ring-2 focus:ring-blue-400"
              value={shopData.shop_name}
              onChange={(e) =>
                setShopData({ ...shopData, shop_name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium">เบอร์โทร</label>
            <input
              type="tel"
              className="w-full px-4 py-2 border rounded-lg outline-none shadow-sm focus:ring-2 focus:ring-blue-400"
              value={shopData.phone_number}
              onChange={(e) =>
                setShopData({ ...shopData, phone_number: e.target.value })
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
                value={shopData.password}
                onChange={(e) =>
                  setShopData({ ...shopData, password: e.target.value })
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
            {updating ? (
              <Loader2 size={20} className="animate-spin mr-2" />
            ) : null}
            บันทึกการเปลี่ยนแปลง
          </Button>
        </form>
      </div>
    </div>
  );
}
