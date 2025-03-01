"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Utensils } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useCategory } from "@/app/context/CategoryContext";

interface Category {
  cate_id: number;
  cate_name: string;
  cate_images: string;
}

interface Shop {
  shop_id: number;
  shop_name: string;
  shop_image: string;
  cate_id: number;
  phone_number: string;
}

const HomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const {
    selectedCategory,
    setSelectedCategory,
    isCategorySelected,
    setIsCategorySelected,
  } = useCategory();
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [shopRes, categoryRes] = await Promise.all([
          fetch("/api/shops"),
          fetch("/api/categories"),
        ]);

        const shopData = await shopRes.json();
        const categoryData = await categoryRes.json();

        if (shopRes.ok) {
          setShops(Array.isArray(shopData.shops) ? shopData.shops : []);
        } else {
          console.error("Error fetching shops:", shopData.error);
        }

        if (categoryRes.ok) {
          setCategories(Array.isArray(categoryData) ? categoryData : []);
        } else {
          console.error("Error fetching categories:", categoryData.error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [status, router]); // ✅ โหลดข้อมูลเมื่อ `status` เปลี่ยน

  // ✅ เช็คก่อน `filter()`
  const filteredShops = Array.isArray(shops)
    ? shops.filter(
        (shop) =>
          shop.shop_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (!selectedCategory || shop.cate_id === selectedCategory)
      )
    : [];

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setIsCategorySelected(true);
  };

  return (
    <div className="p-6">
      {/* ช่องค้นหา */}
      <div className="relative mb-6">
        <input
          type="text"
          className="w-full p-2 pl-10 border rounded-lg"
          placeholder="ค้นหาร้านอาหาร..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>

      {/* ประเภทอาหาร */}
      {searchQuery === "" && (
        <div className="relative w-full overflow-hidden">
          <div className="flex overflow-x-scroll scrollbar-hide snap-x snap-mandatory space-x-4 px-4">
            {categories.map((category) => (
              <div
                key={category.cate_id}
                className="relative flex flex-col items-center cursor-pointer snap-start min-w-[25%]"
                onClick={() => handleCategoryClick(category.cate_id)}
              >
                <div
                  className={`relative w-14 h-14 mb-2 rounded-full overflow-hidden ring-2 transition-all duration-200 ease-in-out
              ${
                selectedCategory === category.cate_id
                  ? "ring-green-500"
                  : "ring-transparent"
              }`}
                >
                  <Image
                    src={category.cate_images || "/images/photo.png"}
                    alt={category.cate_name}
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                  />
                  {/* ✅ ไอคอนถูกตรงกลางล่าง */}
                  {selectedCategory === category.cate_id && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white/80 text-green-600 text-xs px-1 rounded-t-lg">
                      ✔
                    </div>
                  )}
                </div>
                <p className="text-sm text-center w-20 truncate">
                  {category.cate_name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ปุ่มย้อนกลับ */}
      {isCategorySelected && (
        <button
          className="fixed top-3 left-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
          onClick={() => {
            setSelectedCategory(null);
            setIsCategorySelected(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}
      {/* เส้นคั่นหลังประเภทอาหาร */}
      <hr className="my-4 border-t border-gray-300" />

      {/* ร้านอาหารทั้งหมด พร้อมไอคอนที่ดูดีขึ้น */}
      <div className="flex items-center gap-2 mb-4 mt-6">
        <Utensils size={28} className="text-gray-800" />
        <h3 className="text-xl font-bold text-gray-800">ร้านอาหารทั้งหมด</h3>
      </div>

      {filteredShops.length > 0 ? (
        filteredShops.map((shop) => (
          <Card
            key={shop.shop_id}
            className="cursor-pointer flex items-center p-4 mb-4 rounded-lg shadow-sm hover:shadow-md transition"
            onClick={() => router.push(`/menus/${shop.shop_id}`)}
          >
            <Image
              src={shop.shop_image || "/images/photo.png"}
              alt={shop.shop_name}
              width={120}
              height={120}
              className="w-24 h-24 object-cover rounded-lg mr-4"
            />
            <CardContent>
              <CardTitle>{shop.shop_name}</CardTitle>
              <p className="text-sm font-normal text-gray-600 mt-2">
                {categories.find((c) => c.cate_id === shop.cate_id)
                  ?.cate_name || "ไม่ระบุประเภท"}
              </p>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center text-gray-500">
          ไม่พบร้านอาหารที่ตรงกับคำค้นหา
        </p>
      )}
    </div>
  );
};

export default HomePage;
