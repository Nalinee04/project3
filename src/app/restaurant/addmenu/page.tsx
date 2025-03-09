//res/addmenu

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, CheckCircle, XCircle, Image as ImageIcon } from "lucide-react";
import Swal from "sweetalert2";

const AddMenu = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [menuName, setMenuName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [category, setCategory] = useState<number>(0);
  const [status, setStatus] = useState<number>(1);
  const [categories, setCategories] = useState<{ cate_id: number; cate_name: string }[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (!data.error) setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImageUrl(imageUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return setError("กรุณาเลือกรูปภาพ");

    const menuData = {
      shop_id: String(session?.user?.shop_id),
      menu_name: menuName,
      price: String(price),
      cate_id: String(category),
      status: String(status),
      menu_image: imageUrl,
    };

    const res = await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(menuData),
    });

    const data = await res.json();
    if (data.error) setError(data.error);
    else {
      Swal.fire({
        title: "เพิ่มเมนูสำเร็จ!",
        icon: "success",
        draggable: true,
      }).then(() => {
        router.push("/restaurant/menu");
      });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="w-full bg-yellow-500 text-white py-4 px-6 flex items-center shadow-md fixed top-0 left-0 right-0 z-10">
        <button onClick={() => router.back()} className="p-2">
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        <h1 className="text-lg font-semibold mx-auto">เพิ่มเมนูใหม่</h1>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md mt-16">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">เพิ่มเมนูใหม่</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
            className="w-full p-3 border rounded-md"
            placeholder="ชื่อเมนู"
            required
          />

          <input
            type="text"
            value={price}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              setPrice(value === "" ? "" : Number(value));
            }}
            className="w-full p-3 border rounded-md"
            placeholder="ราคา (บาท)"
            required
          />

          <select
            value={category}
            onChange={(e) => setCategory(Number(e.target.value))}
            className="w-full p-3 border rounded-md"
            required
          >
            <option value={0}>เลือกหมวดหมู่</option>
            {categories.map((cate) => (
              <option key={cate.cate_id} value={cate.cate_id}>
                {cate.cate_name}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(Number(e.target.value))}
            className="w-full p-3 border rounded-md"
          >
            <option value={1}>เปิดเมนู</option>
            <option value={0}>ปิดเมนู</option>
          </select>

          <div className="border p-4 rounded-lg text-center">
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              {imageUrl ? (
                <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover rounded-md" />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <ImageIcon className="h-12 w-12" />
                  <p>อัปโหลดรูปภาพ</p>
                </div>
              )}
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-md"
          >
            เพิ่มเมนู
          </button>

          {error && (
            <div className="flex items-center text-red-600 mt-2">
              <XCircle className="h-5 w-5 mr-1" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddMenu;
