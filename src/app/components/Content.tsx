"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useCart } from "../components/CartContext";

const Content = () => {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [size, setSize] = useState("ธรรมดา");
  const [note, setNote] = useState("");

  const categories = [
    { id: 1, name: "ตามสั่ง", iconUrl: "/images/ตามสั่ง.jpg" },
    { id: 2, name: "จานเดียว", iconUrl: "/images/rice.png" },
    { id: 3, name: "อาหารเส้น", iconUrl: "/images/ก๋วย.png" },
    { id: 4, name: "ของทานเล่น", iconUrl: "/images/ทานเล่นนน.webp" },
  ];

  const restaurants = [
    {
      id: "r1",
      name: "ร้านไข่เจียวมาแล้วจ้า ",
      imageUrl: "/images/ร้านไข่เจียว.jpg",
      category: "จานเดียว",
      menu: [
        {
          id: "m1",
          title: "ข้าวไข่เจียว",
          price: 30,
          imageUrl: "/images/ข้าวไข่จ้า.webp",
        },
        {
          id: "m2",
          title: "ข้าวกะเพราทะเล",
          price: 45,
          imageUrl: "/images/กะเพราหมึกไข่.jpg",
        },
      ],
    },
    {
      id: "r2",
      name: "ราชาบะหมี่เกี้ยว ",
      imageUrl: "/images/ร้านราชาบะหมี่.jpg",
      category: "อาหารเส้น",
      menu: [
        {
          id: "m3",
          title: "บะหมี่เกี๊ยว",
          price: 40,
          imageUrl: "/images/บะหมี่เกี๊ยว.jpg",
        },
        {
          id: "m4",
          title: "บะหมี่หมูแดง",
          price: 40,
          imageUrl: "/images/หมู.jpg",
        },
      ],
    },
    {
      id: "r3",
      name: "ไก่แซ่บมุฟลีฮูน  ",
      imageUrl: "/images/ร้านไก่แซ่บ.jpg",
      category: "ของทานเล่น",
      menu: [
        {
          id: "m5",
          title: "ไก่วิงค์แซ่บ",
          price: 15,
          imageUrl: "/images/ไก่วิงค์.jpg",
        },
        {
          id: "m6",
          title: "ไก่กรอบ",
          price: 10,
          imageUrl: "/images/ไก่กรอบ.jpg",
        },
      ],
    },
    {
      id: "r4",
      name: "ร้านพ่อกับแม่ ",
      imageUrl: "/images/ร้านพ่อกับแม่.jpg",
      category: "ตามสั่ง",
      menu: [
        {
          id: "m7",
          title: "ข้าวผัดหมู",
          price: 40,
          imageUrl: "/images/ข้าวผัดหมู.jpg",
        },
        {
          id: "m8",
          title: "ข้าวคะน้า",
          price: 40,
          imageUrl: "/images/ข้าวคะน้า.jpg",
        },
      ],
    },
    {
      id: "r5",
      name: "ร้านราดหน้ายอดผัก ",
      imageUrl: "/images/ร้านราดหน้า.jpg",
      category: "จานเดียว",
      menu: [
        {
          id: "m9",
          title: "ราดหน้าหมู",
          price: 30,
          imageUrl: "/images/ราดหน้าหมู.jpg",
        },
        {
          id: "m10",
          title: "ราดหน้าทะเล",
          price: 35,
          imageUrl: "/images/ราดหน้าทะเล.webp",
        },
      ],
    },
    {
      id: "r6",
      name: "ร้านกินเส้น ",
      imageUrl: "/images/ร้านกินเส้น.jpg",
      category: "อาหารเส้น",
      menu: [
        {
          id: "m9",
          title: "ราดหน้าหมู",
          price: 30,
          imageUrl: "/images/ราดหน้าหมู.jpg",
        },
        {
          id: "m10",
          title: "ราดหน้าทะเล",
          price: 35,
          imageUrl: "/images/ราดหน้าทะเล.webp",
        },
      ],
    },
    {
      id: "r7",
      name: "ร้านมาตะ ก๋วยเตี๋ยว  ",
      imageUrl: "/images/ร้านมาตะ.jpg",
      category: "จานเดียว",
      menu: [
        {
          id: "m9",
          title: "ราดหน้าหมู",
          price: 30,
          imageUrl: "/images/ราดหน้าหมู.jpg",
        },
        {
          id: "m10",
          title: "ราดหน้าทะเล",
          price: 35,
          imageUrl: "/images/ราดหน้าทะเล.webp",
        },
      ],
    },
    {
      id: "r8",
      name: "ร้านครัวตุ๊กกี้   ",
      imageUrl: "/images/ร้านครัวตุ๊ก.jpg",
      category: "ตามสั่ง",
      menu: [
        {
          id: "m9",
          title: "ราดหน้าหมู",
          price: 30,
          imageUrl: "/images/ราดหน้าหมู.jpg",
        },
        {
          id: "m10",
          title: "ราดหน้าทะเล",
          price: 35,
          imageUrl: "/images/ราดหน้าทะเล.webp",
        },
      ],
    },
    {
      id: "r9",
      name: "ร้านป้าน้อย    ",
      imageUrl: "/images/ร้านป้าน้อย.jpg",
      category: "ตามสั่ง",
      menu: [
        {
          id: "m9",
          title: "ราดหน้าหมู",
          price: 30,
          imageUrl: "/images/ราดหน้าหมู.jpg",
        },
        {
          id: "m10",
          title: "ราดหน้าทะเล",
          price: 35,
          imageUrl: "/images/ราดหน้าทะเล.webp",
        },
      ],
    },
    {
      id: "r10",
      name: "ครัวบังดาวุด อาหารตามสั่ง    ",
      imageUrl: "/images/ครัวบัง.jpg",
      category: "ตามสั่ง",
      menu: [
        {
          id: "m9",
          title: "ราดหน้าหมู",
          price: 30,
          imageUrl: "/images/ราดหน้าหมู.jpg",
        },
        {
          id: "m10",
          title: "ราดหน้าทะเล",
          price: 35,
          imageUrl: "/images/ราดหน้าทะเล.webp",
        },
      ],
    },
    
    
  ];

  const handleAddToCart = () => {
    if (!selectedMenuItem) return;
    const finalPrice =
      size === "พิเศษ" ? selectedMenuItem.price + 10 : selectedMenuItem.price;
    addToCart({ ...selectedMenuItem, size, note, price: finalPrice });

    // Reset state
    setSelectedMenuItem(null);
    setSize("ธรรมดา");
    setNote("");
  };

  return (
    <div className="p-6">
      <input
        type="text"
        placeholder="ค้นหาร้านอาหารหรือเมนูอาหาร"
        className="w-full p-2 border rounded-lg mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="flex justify-center gap-4 mb-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`text-center cursor-pointer ${
              selectedCategory === category.name
                ? "border-b-4 border-blue-500"
                : ""
            }`}
            onClick={() =>
              setSelectedCategory(
                selectedCategory === category.name ? null : category.name
              )
            }
          >
            <img
              src={category.iconUrl}
              alt={category.name}
              className="w-16 h-16 rounded-full"
            />
            <p className="text-sm mt-2">{category.name}</p>
          </div>
        ))}
      </div>

      {/* แสดงรายละเอียดเมนูที่เลือก */}
      {selectedMenuItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 p-6">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-2">{selectedMenuItem.title}</h2>
            <Image
              src={selectedMenuItem.imageUrl}
              alt={selectedMenuItem.title}
              width={200}
              height={200}
              className="mb-4"
            />

            {/* เลือกขนาด */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">เลือกขนาด:</label>
              <div className="flex flex-col space-y-2">
                <label className="flex items-center border p-2 rounded-lg cursor-pointer justify-between">
                  <input
                    type="radio"
                    name="size"
                    checked={size === "ธรรมดา"}
                    onChange={() => setSize("ธรรมดา")}
                    className="w-5 h-5 mr-2"
                  />
                  <span className="flex-grow">ธรรมดา</span>
                  <span>+0</span>
                </label>
                <label className="flex items-center border p-2 rounded-lg cursor-pointer justify-between">
                  <input
                    type="radio"
                    name="size"
                    checked={size === "พิเศษ"}
                    onChange={() => setSize("พิเศษ")}
                    className="w-5 h-5 mr-2"
                  />
                  <span className="flex-grow">พิเศษ</span>
                  <span>+10</span>
                </label>
              </div>
            </div>

            {/* เพิ่มหมายเหตุ */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">หมายเหตุ:</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="เพิ่มหมายเหตุ เช่น ไม่ใส่ผัก"
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {/* ปุ่มเพิ่มลงตะกร้า และปิด */}
            <div className="flex justify-between">
              <Button
                onClick={() => setSelectedMenuItem(null)}
                className="bg-gray-400"
              >
                ยกเลิก
              </Button>
              <Button onClick={handleAddToCart} className="bg-green-500">
                เพิ่มลงตะกร้า
              </Button>
            </div>
          </div>
        </div>
      )}

      {selectedRestaurant ? (
        <div>
          <button onClick={() => setSelectedRestaurant(null)} className="mb-4">
            ⬅
          </button>
          <h2 className="text-xl font-bold mb-4">{selectedRestaurant.name}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-10 place-items-center">
            {selectedRestaurant.menu.map((menuItem) => (
              <Card
                key={menuItem.id}
                onClick={() => setSelectedMenuItem(menuItem)}
                className="cursor-pointer w-[160px] h-[180px] flex flex-col items-center p-2 shadow-lg rounded-lg"
              >
                <Image
                  src={menuItem.imageUrl || "/images/default.jpg"}
                  alt={menuItem.title}
                  width={160}
                  height={120}
                  className="w-[160px] h-[120px] object-cover aspect-[4/3] rounded-md"
                />
                <CardContent className="text-center mt-2 flex flex-col items-center justify-center">
                  <CardTitle className="text-sm font-semibold text-center leading-tight">
                    {menuItem.title}
                  </CardTitle>
                  <p className="text-gray-600 text-sm mt-1">
                    ฿{menuItem.price}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {restaurants
            .filter(
              (restaurant) =>
                (!selectedCategory ||
                  restaurant.category === selectedCategory) &&
                restaurant.name.includes(searchQuery)
            )
            .map((restaurant) => (
              <Card
                key={restaurant.id} // ✅ ใช้ restaurant.id
                className="cursor-pointer flex items-center p-4"
                onClick={() => setSelectedRestaurant(restaurant)}
              >
                <Image
                  src={restaurant.imageUrl || "/images/default.jpg"}
                  alt={restaurant.name}
                  width={100}
                  height={100}
                  className="rounded-lg mr-4"
                />

                <CardContent>
                  <CardTitle>{restaurant.name}</CardTitle>
                  <p className="text-sm text-gray-500">{restaurant.category}</p>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default Content;
