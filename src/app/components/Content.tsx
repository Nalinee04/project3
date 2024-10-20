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
import PaginationPage from "./Pagination";

const Content = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("All Menu");

  const products = [
    // Coffee
    {
      id: "1",
      title: "Americano",
      description: "Americano หอมกรุ่น",
      imageUrl: "/images/americano.jpg",
      price: 60,
      available: 15,
      sold: 20,
      discount: 5,
      category: "Coffee",
    },
    {
      id: "2",
      title: "Cappuccino",
      description: "คาปูชิโน่ หวานมัน",
      imageUrl: "/images/capuccino.jpg.jpeg",
      price: 65,
      available: 10,
      sold: 30,
      discount: 10,
      category: "Coffee",
    },
    {
      id: "3",
      title: "Espresso",
      description: "เอสเปรสโซ่เข้มข้น",
      imageUrl: "/images/Espresso.jpg",
      price: 55,
      available: 8,
      sold: 15,
      discount: 0,
      category: "Coffee",
    },
    {
      id: "4",
      title: "Mocha",
      description: "มอคค่าเข้มๆ",
      imageUrl: "/images/mocha.jpg",
      price: 70,
      available: 12,
      sold: 25,
      discount: 10,
      category: "Coffee",
    },
    {
      id: "5",
      title: "Latte",
      description: "ลาเต้เนียนนุ่ม",
      imageUrl: "/images/Latte.jpg",
      price: 65,
      available: 20,
      sold: 18,
      discount: 0,
      category: "Coffee",
    },
    {
      id: "6",
      title: "Cold Brew",
      description: "Cold Brew หวานหอม",
      imageUrl: "/images/Cold Brew.jpg",
      price: 75,
      available: 10,
      sold: 22,
      discount: 15,
      category: "Coffee",
    },
    {
      id: "7",
      title: "Caramel Macchiato",
      description: "คาราเมลมัคคิอาโต้",
      imageUrl: "/images/Caramel Macchiato.jpg",
      price: 80,
      available: 7,
      sold: 12,
      discount: 5,
      category: "Coffee",
    },
    {
      id: "8",
      title: "Affogato",
      description: "Affogato ไอศกรีมกับกาแฟ",
      imageUrl: "/images/Affogato.webp",
      price: 90,
      available: 5,
      sold: 20,
      discount: 0,
      category: "Coffee",
    },

    // Tea
    {
      id: "9",
      title: "ชาไทย",
      description: "ชาไทยแท้ต้นตำหรับ",
      imageUrl: "/images/ชาไทย.jpg",
      price: 50,
      available: 10,
      sold: 20,
      discount: 10,
      category: "Tea",
    },
    {
      id: "10",
      title: "ชาเขียว",
      description: "ชาเขียวมัทฉะจากเชียงใหม่",
      imageUrl: "/images/ชาเขียว.jpg",
      price: 80,
      available: 15,
      sold: 5,
      discount: 10,
      category: "Tea",
    },
    {
      id: "11",
      title: "ชานมไข่มุก",
      description: "ชานมไข่มุกหวานหอม",
      imageUrl: "/images/Cream Cheese.webp",
      price: 95,
      available: 5,
      sold: 10,
      discount: 10,
      category: "Tea",
    },
    {
      id: "12",
      title: "ชามะนาว",
      description: "ชามะนาวสดชื่น",
      imageUrl: "/images/lemon.jpg",
      price: 65,
      available: 20,
      sold: 12,
      discount: 5,
      category: "Tea",
    },
    {
      id: "13",
      title: "ชาเขียวมัทฉะลาเต้",
      description: "มัทฉะลาเต้หอมมัน",
      imageUrl: "/images/ชาเขียวมัทฉะลาเต้.jpg",
      price: 85,
      available: 10,
      sold: 18,
      discount: 0,
      category: "Tea",
    },
    {
      id: "14",
      title: "ชาเย็น",
      description: "ชาเย็นสูตรพิเศษ",
      imageUrl: "/images/ชาเย็น.webp",
      price: 50,
      available: 15,
      sold: 25,
      discount: 5,
      category: "Tea",
    },

    // Mocktail
    {
      id: "17",
      title: "Virgin Mojito",
      description: "ม็อกเทลมินต์",
      imageUrl: "/images/Virgin Mojito.jpg",
      price: 120,
      available: 8,
      sold: 15,
      discount: 0,
      category: "Mocktail",
    },
    {
      id: "18",
      title: "Shirley Temple",
      description: "ชาลีเทมเปิล หวานซ่า",
      imageUrl: "/images/Shirley Temple.jpg",
      price: 110,
      available: 10,
      sold: 20,
      discount: 10,
      category: "Mocktail",
    },
    {
      id: "19",
      title: "Sunrise Surprise",
      description: "ซันไรส์ซูร์ไพรส์ หอมสดชื่น",
      imageUrl: "/images/Sunrise Surprise.jpg",
      price: 130,
      available: 5,
      sold: 12,
      discount: 5,
      category: "Mocktail",
    },
    {
      id: "20",
      title: "Tropical Twist",
      description: "ทรอปิคอลทวิสต์ หอมหวานสดชื่นด้วยผลไม้รวม",
      imageUrl: "/images/Tropical Twist.webp",
      price: 140,
      available: 8,
      sold: 15,
      discount: 10,
      category: "Mocktail",
    },
    {
      id: "21",
      title: "Berry Bliss",
      description: "เบอร์รี่บลิส ความสดชื่นจากผลไม้ตระกูลเบอร์รี่",
      imageUrl: "/images/berry.avif",
      price: 150,
      available: 6,
      sold: 10,
      discount: 7,
      category: "Mocktail",
    },
    {
      id: "22",
      title: "Citrus Splash",
      description: "ซิตรัสสแปลช รสเปรี้ยวสดชื่นจากซิตรัส",
      imageUrl: "/images/citrus.webp",
      price: 135,
      available: 9,
      sold: 20,
      discount: 8,
      category: "Mocktail",
    },
    

    // Rice
    {
      id: "23",
      title: "กะเพราหมึกไข่",
      description: "ม็อกเทลมินต์",
      imageUrl: "/images/กะเพราหมึกไข่.jpg",
      price: 120,
      available: 8,
      sold: 15,
      discount: 0,
      category: "Rice",
    },
    {
      id: "24",
      title: "ข้าวผัดปู",
      description: "ชาลีเทมเปิล หวานซ่า",
      imageUrl: "/images/ข้าวผัดปู.webp",
      price: 110,
      available: 10,
      sold: 20,
      discount: 10,
      category: "Rice",
    },
    {
      id: "25",
      title: "ข้าวผัดต้มยำทะเล",
      description: "ซันไรส์ซูร์ไพรส์ หอมสดชื่น",
      imageUrl: "/images/ข้าวผัดต้มยำทะเล.jpg",
      price: 130,
      available: 5,
      sold: 12,
      discount: 5,
      category: "Rice",
    },
    {
      id: "26",
      title: "ข้าวคะน้าหมูกรอบ",
      description: "ซันไรส์ซูร์ไพรส์ หอมสดชื่น",
      imageUrl: "/images/คะน้าหมู.jpg",
      price: 130,
      available: 5,
      sold: 12,
      discount: 5,
      category: "Rice",
    },
    {
      id: "27",
      title: "ข้าวกะเพรากุ้ง",
      description: "ซันไรส์ซูร์ไพรส์ หอมสดชื่น",
      imageUrl: "/images/กะเพรากุ้ง.jpg",
      price: 130,
      available: 5,
      sold: 12,
      discount: 5,
      category: "Rice",
    },
    // Pasta
    {
      id: "28",
      title: "พาสต้าเบค่อน",
      description: "ซันไรส์ซูร์ไพรส์ หอมสดชื่น",
      imageUrl: "/images/พาสต้าเบค่อน.webp",
      price: 130,
      available: 5,
      sold: 12,
      discount: 5,
      category: "Pasta",
    },
    {
      id: "29",
      title: "พาสต้าเพสโต้",
      description: "พาสต้าเพสโต้ซอสโหระพาหอมอร่อย",
      imageUrl: "/images/เพลโต้.webp",
      price: 140,
      available: 7,
      sold: 10,
      discount: 8,
      category: "Pasta",
    },
    {
      id: "30",
      title: "สปาเก็ตตี้ขี้เมากุ้ง",
      description: "พาสต้าซีฟู้ดรวมรสชาติทะเลสดใหม่",
      imageUrl: "/images/ขี้เมากุ้ง.webp",
      price: 160,
      available: 6,
      sold: 14,
      discount: 10,
      category: "Pasta",
    },
    {
      id: "31",
      title: "พาสต้าอาราเบียต้า",
      description: "พาสต้าอาราเบียต้าซอสเผ็ดร้อน",
      imageUrl: "/images/เบียต้า.jpg",
      price: 150,
      available: 8,
      sold: 9,
      discount: 7,
      category: "Pasta",
    },
    {
      id: "32",
      title: "สปาเก็ตตี้ไก่สับซอสมะเขือเทศ",
      description: "พาสต้าแฮมในครีมซอสเนื้อเนียน",
      imageUrl: "/images/ไก่เทศ.jpg",
      price: 155,
      available: 10,
      sold: 18,
      discount: 5,
      category: "Pasta",
    },
    // Burgur
    {
      id: "33",
      title: "เบอร์เกอร์ไก่กรอบ",
      description: "ซันไรส์ซูร์ไพรส์ หอมสดชื่น",
      imageUrl: "/images/เกอร์ไก่.jpg",
      price: 130,
      available: 5,
      sold: 12,
      discount: 5,
      category: "Burger",
    },
    {
      id: "34",
      title: "เบอร์เกอร์เนื้อ",
      description: "ซันไรส์ซูร์ไพรส์ หอมสดชื่น",
      imageUrl: "/images/เกอร์เนื้อ.png",
      price: 130,
      available: 5,
      sold: 12,
      discount: 5,
      category: "Burger",
    },
    {
      id: "35",
      title: "เบอร์เกอร์ปลา",
      description: "เบอร์เกอร์ปลากรอบนอกนุ่มใน รสชาติเยี่ยม",
      imageUrl: "/images/เกอร์ปลา.jpg",
      price: 135,
      available: 7,
      sold: 10,
      discount: 8,
      category: "Burger",
    },
    {
      id: "36",
      title: "เบอร์เกอร์หมู",
      description: "เบอร์เกอร์หมูเนื้อนุ่ม อร่อยเต็มคำ",
      imageUrl: "/images/เกอร์หมู.webp",
      price: 140,
      available: 6,
      sold: 14,
      discount: 10,
      category: "Burger",
    },
    {
      id: "37",
      title: "เบอร์เกอร์ไก่สไปซี่",
      description: "เบอร์เกอร์ไก่สไปซี่ เผ็ดกำลังดี",
      imageUrl: "/images/ไก่ซี่.jpg",
      price: 145,
      available: 8,
      sold: 9,
      discount: 7,
      category: "Burger",
    },
    {
      id: "38",
      title: "คีโตเบอร์เกอร์ซุปเปอร์โบลว์",
      description: "เบอร์เกอร์เบคอนกรอบกับชีสเยิ้มๆ",
      imageUrl: "/images/super.jpg",
      price: 150,
      available: 10,
      sold: 18,
      discount: 5,
      category: "Burger",
    },
  ];

  const categories = [
    { id: 1, name: "All Menu", iconUrl: "/images/allmenu.png" },
    { id: 2, name: "Coffee", iconUrl: "/images/coffee.jpg" },
    { id: 3, name: "Tea", iconUrl: "/images/tea.png" },
    { id: 4, name: "Mocktail", iconUrl: "/images/mocktail.png" },
    { id: 5, name: "Rice", iconUrl: "/images/rice.png" },
    { id: 6, name: "Pasta", iconUrl: "/images/pasta.jpg" },
    { id: 7, name: "Burger", iconUrl: "/images/burger.png" },
    // เพิ่มประเภทอื่นๆ ตามต้องการ...
  ];

  // ฟิลเตอร์สินค้าตามประเภท
  const filteredProducts =
    selectedCategory === "All Menu"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);
  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  // กำหนดรายการที่จะแสดงสำหรับหน้าปัจจุบัน
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setCurrentPage(1);
  };
  return (
    <div className="p-6">
      {/* Categories */}
      <div className="max-w-[90%] mx-auto mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-5">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col items-center bg-card p-4 rounded-lg shadow-md cursor-pointer"
            onClick={() => handleSelectCategory(category.name)}
          >
            <img
              src={category.iconUrl}
              alt={category.name}
              className="w-12 h-12 object-cover mb-2"
            />
            <span className="text-center text-sm font-medium">
              {category.name}
            </span>
          </div>
        ))}
      </div>

      {/* Product Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[90%] mx-auto">
        {currentItems.map((product) => (
          <Card key={product.id} className="relative p-4 shadow-lg rounded-2xl flex flex-col">
            <CardHeader className="p-0">
              <div className="relative w-full h-64 rounded-t-xl overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-xl"
                />
                {product.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold py-1 px-2 rounded-full">
                    {product.discount}% Off
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg font-semibold mt-2">
                {product.title}
              </CardTitle>
              <div className="flex justify-between items-center text-sm text-gray-600 dark:text-white mb-2">
                <div>{product.available} Available</div>
                <div>{product.sold} Sold</div>
              </div>
              <div className="text-lg font-semibold text-black dark:text-white">
                ฿{product.price.toFixed(2)}{" "}
                <span className="text-xs text-gray-400">/ Portion</span>
              </div>
              {product.discount > 0 && (
                <div className="text-sm text-gray-400 line-through">
                  ฿{(product.price / (1 - product.discount / 100)).toFixed(2)}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex mt-auto">
              <Button
                className={`w-full py-2 text-center hover:text-white dark:hover:text-black ${
                  product.available > 0
                    ? "bg-black text-white"
                    : "bg-gray-400 text-black cursor-not-allowed"
                }`}
                disabled={product.available === 0}
                onClick={() =>
                  addToCart({
                    id: product.id,
                    name: product.title,
                    price: product.price,
                    image: product.imageUrl,
                    quantity: 1,
                  })
                }
              >
                {product.available > 0 ? "ใส่ตะกร้า" : "สินค้าหมด"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* ใช้คอมโพเนนต์ PaginationPage */}
      <div className="p-4">
        <PaginationPage
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Content;
