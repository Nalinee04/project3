"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useCart } from "../components/CartContext";
import Slider from "react-slick"; // เพิ่มการนำเข้า react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom Arrow Components
const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", left: "10px", zIndex: "10" }} // ปรับตำแหน่ง Arrow ซ้าย
      onClick={onClick}
    />
  );
};

const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: "10px", zIndex: "10" }} // ปรับตำแหน่ง Arrow ขวา
      onClick={onClick}
    />
  );
};

const Content = () => {
  const { addToCart } = useCart();

  const products = [
    {
      id: "1",
      title: "ชาไทย",
      description: "ชาไทยแท้ต้นตำหรับ",
      imageUrl: "/images/ชาไทย.jpg",
      price: 50,
    },
    {
      id: "2",
      title: "กุ้งเผา",
      description: "กุ้งเผาเจ้าพระยา",
      imageUrl: "/images/กุ้งเผา.jpg",
      price: 300,
    },
    {
      id: "3",
      title: "โกโก้",
      description: "โกโก้เย็น",
      imageUrl: "/images/โกโก้.jpg",
      price: 45,
    },
    {
      id: "4",
      title: "ต้มยำกุ้ง",
      description: "ต้มยำกุ้งน้ำข้น รสแซ่บเด็ดดวง",
      imageUrl: "/images/ต้มยำกุ้ง.jpg",
      price: 120,
    },
    {
      id: "5",
      title: "ต้มยำปลาหมึกน้ำข้น",
      description: "ต้มยำปลาหมึกน้ำข้น รสสูตรชาววัง",
      imageUrl: "/images/ต้มยำปลาหมึกน้ำข้น.jpg",
      price: 150,
    },
    {
      id: "6",
      title: "ยำรวมมิตร",
      description: "ยำรวมมิตร เอาใจสายแซ่บ",
      imageUrl: "/images/ยำรวมมิตร.webp",
      price: 150,
    },
    {
      id: "7",
      title: "ชาเขียว",
      description: "ชาเขียว มัทฉะจากเชียงใหม่",
      imageUrl: "/images/ชาเขียว.jpg",
      price: 80,
    },
    {
      id: "8",
      title: "เค้กส้ม",
      description: "เด้กส้ม เจ้าตัวน้อย",
      imageUrl: "/images/เค้กส้ม.webp",
      price: 250,
    },
    {
      id: "9",
      title: "เค้กบลูเบอร์รี่",
      description: "เด้กบลูเบอร์ เอาใจคนชอบสายม่วง",
      imageUrl: "/images/เค้กบลูเบอร์รี่.jpg",
      price: 250,
    },
    {
      id: "10",
      title: "เค้กบลูเบอร์รี่",
      description: "เด้กบลูเบอร์ เอาใจคนชอบสายม่วง",
      imageUrl: "/images/เค้กบลูเบอร์รี่.jpg",
      price: 250,
    },
  ];

  // สไลด์โปรโมชัน
  const slides = [
    { id: "slide1", imageUrl: "/images/โปรโมชั่น.jpg" },
    { id: "slide2", imageUrl: "/images/โปรโมชั่น.jpg" },
    { id: "slide3", imageUrl: "/images/โปรโมชั่น.jpg" },
  ];

  // การตั้งค่าของ slider
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  return (
    <div>
      {/* สไลด์โชว์ */}
      <div className="max-w-[90%] mx-auto mb-6"> {/* ปรับให้เหมือนกับขนาดสินค้าที่แสดงด้านล่าง */}
        <Slider {...sliderSettings}>
          {slides.map((slide) => (
            <div key={slide.id}>
              <img
                src={slide.imageUrl}
                alt={`Slide ${slide.id}`}
                className="w-full h-[300px] object-cover rounded-lg shadow-lg" // ปรับความกว้างและความสูงของสไลด์
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* การแสดงสินค้า */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-10 max-w-[90%] mx-auto">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-40">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className="object-contain"
                  sizes="(min-width: 800px) 50vw, 100vw"
                />
              </div>
              <p>{product.description}</p>
              <CardDescription>{product.description}</CardDescription>
            </CardContent>
            <CardFooter className="justify-end">
              <Button
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
                ใส่ตะกร้า
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Content;
