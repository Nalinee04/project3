"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import SweetAlert from "@/components/ui/sweetAlert";
import { QrCode } from "lucide-react";

interface CartItem {
  cart_id: string; // เพิ่ม cart_id
  item_id: string;
  product_name: string;
  price: number;
  quantity: number;
  image_url: string;
  details?: string;
}

const ConfirmationPage = () => {
  const searchParams = useSearchParams();
  const cartIdFromParams = searchParams.get("cart_id");

  let parsedCartId = null;
  try {
    // ตรวจสอบว่า cart_id มีค่าหรือไม่และแปลงเป็น JSON
    if (cartIdFromParams) {
      parsedCartId = decodeURIComponent(cartIdFromParams); // ไม่ต้องแปลงเป็น JSON ถ้าไม่จำเป็น
    }
  } catch (error) {
    console.error("Error parsing cart_id:", error);
  }

  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shopId, setShopId] = useState<string | null>(null); // ✅ ใช้ useState
  const [deliveryType, setDeliveryType] = useState("ส่งอาหารตามที่อยู่");
  const [outOfStockAction, setOutOfStockAction] = useState(
    "ติดต่อฉันเพื่อหาสินค้าแทน"
  );
  const [restaurantNote, setRestaurantNote] = useState(""); // เพิ่ม state สำหรับหมายเหตุถึงร้านอาหาร

  const [paymentMethod, setPaymentMethod] = useState(" คิวอาร์โค้ด");

  useEffect(() => {
    console.log("🔎 Query String:", searchParams.toString()); // ✅ ดูค่าที่ส่งมาใน URL

    const shopIdFromParams = searchParams.get("shop_id");
    console.log("✅ Shop ID:", shopIdFromParams); // ✅ ตรวจสอบค่า shop_id
    setShopId(shopIdFromParams || null); // 🔥 บันทึกค่า shop_id ลง state

    const queryId = searchParams.getAll("id");
    console.log("🛒 ID ของสินค้า:", queryId); // ✅ ดูว่าสินค้าในตะกร้ามาหรือไม่

    if (queryId.length > 0) {
      const items: CartItem[] = queryId.map((id, i) => {
        const cartId = `${id}-${searchParams.getAll("options")[i] || ""}-${
          searchParams.getAll("note")[i] || ""
        }`;
        return {
          cart_id: cartId, // เพิ่ม cart_id
          item_id: id || `item-${i}`,
          product_name: searchParams.getAll("name")[i] || "ไม่ทราบชื่อเมนู",
          price: parseFloat(searchParams.getAll("price")[i]) || 0,
          quantity: Math.max(
            parseInt(searchParams.getAll("quantity")[i]) || 1,
            1
          ),
          image_url: searchParams.getAll("image")[i] || "/images/photo.png",
          details: searchParams.getAll("details")[i] || "",
        };
      });
      setCartItems(items); // บันทึกข้อมูลสินค้าใน cartItems
    }
  }, [searchParams]);

  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) {
      SweetAlert(false, () => alert("ไม่มีสินค้าในตะกร้า"));
      return;
    }

    if (!shopId) {
      alert("เกิดข้อผิดพลาด: ไม่พบร้านค้า");
      return;
    }

    const totalAmount = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const qrUrl = `/qr?shop_id=${shopId}&amount=${totalAmount}`;
    console.log("Redirecting to:", qrUrl); // ✅ ตรวจสอบ URL
    router.push(qrUrl);
  };

  const handleRemoveItem = (cartId: string) => {
    const updatedCart = cartItems.filter((item) => item.cart_id !== cartId);
    setCartItems(updatedCart);

    if (updatedCart.length === 0) {
      // หากตะกร้าว่างให้ไปหน้าหลัก
      router.push("/home");
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center pb-4 border-b">
          <h2 className="text-lg font-semibold">สรุปคำสั่งซื้อ</h2>
          <button
            className="border-2 border-black text-black text-sm font-semibold px-4 py-1 rounded-full bg-white"
            onClick={() => router.push(shopId ? `/menus/${shopId}` : "/home")}
          >
            เพิ่มรายการ
          </button>
        </div>

        {cartItems.length > 0 ? (
          <div className="divide-y divide-gray-300">
            {cartItems.map((item) => (
              <div key={item.item_id} className="flex items-start gap-4 py-4">
                <div className="flex items-end gap-2">
                  <div className="w-20 h-20">
                    <Image
                      src={item.image_url}
                      alt={item.product_name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                  <span className="text-xs bg-gray-200 text-black px-2 py-0.5 rounded">
                    x{item.quantity}
                  </span>
                </div>

                <div className="flex-1">
                  <p className="font-semibold">{item.product_name}</p>
                  {item.details && (
                    <p className="text-sm text-gray-500">{item.details}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                      onClick={() =>
                        router.push(`/detail?menu_id=${item.item_id}`)
                      }
                    >
                      แก้ไข
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm ml-4"
                      onClick={() => handleRemoveItem(item.cart_id)} // ใช้ cart_id
                    >
                      ลบ
                    </button>
                  </div>
                </div>
                <p className="font-semibold">฿{item.price}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4">ไม่มีสินค้าในตะกร้า</p>
        )}

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between text-md font-semibold">
            <span>รวมค่าอาหาร</span>
            <span>
              ฿
              {cartItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0
              )}
            </span>
          </div>
          <div className="flex justify-between text-lg font-semibold border-t pt-4 mt-2">
            <span>รวมทั้งหมด</span>
            <span>
              ฿
              {cartItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0
              )}
            </span>
          </div>
        </div>

        {/* 🔥 เพิ่ม UI เลือกประเภทการรับอาหาร */}
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-md font-semibold">เลือกประเภทการรับอาหาร</h3>
          <div
            className="mt-2 flex items-center gap-2 p-3 cursor-pointer"
            onClick={() => setDeliveryType("รับกลับบ้าน")}
          >
            <div
              className={`w-5 h-5 border-2 rounded-full flex items-center justify-center 
                    ${deliveryType === "รับกลับบ้าน" ? "border-yellow-500" : "border-gray-300"}`}
            >
              {deliveryType === "รับกลับบ้าน" && (
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              )}
            </div>
            <span>รับกลับบ้าน</span>
          </div>
        </div>

        {/* 🔥 UI เลือกวิธีการชำระเงิน */}
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-md font-semibold">เลือกวิธีการชำระเงิน</h3>
          <div
            className="mt-2 flex items-center gap-2 p-3 cursor-pointer"
            onClick={() => setPaymentMethod("คิวอาร์โค้ด")}
          >
            <div
              className={`w-5 h-5 border-2 rounded-full flex items-center justify-center 
                  ${paymentMethod === "คิวอาร์โค้ด" ? "border-yellow-500" : "border-gray-300"}`}
            >
              {paymentMethod === "คิวอาร์โค้ด" && (
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              )}
            </div>
            <span className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-gray-600" />
              คิวอาร์โค้ด
            </span>
          </div>
        </div>

        {/* วิธีดำเนินการกรณีของหมด */}
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-md font-semibold">วิธีดำเนินการกรณีของหมด</h3>
          <select
            className="mt-2 p-2 border rounded w-full"
            value={outOfStockAction}
            onChange={(e) => setOutOfStockAction(e.target.value)}
          >
            <option value="ติดต่อฉันเพื่อหาสินค้าแทน">
              ติดต่อฉันเพื่อหาสินค้าแทน
            </option>
            <option value="ยกเลิกรายการนี้หากของหมด">
              ยกเลิกรายการนี้หากของหมด
            </option>
          </select>
        </div>

        {/* หมายเหตุถึงร้านอาหาร */}
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-md font-semibold">หมายเหตุถึงร้านอาหาร</h3>
          <textarea
            className="mt-2 p-2 border rounded w-full"
            rows={3}
            placeholder="ระบุรายละเอียดเพิ่มเติม เช่น ไม่ใส่ผัก..."
            value={restaurantNote}
            onChange={(e) => setRestaurantNote(e.target.value)}
          ></textarea>
        </div>

        <div className="fixed bottom-0 left-0 w-full bg-white shadow-md p-4">
          <button
            className="w-full bg-yellow-500 text-white py-3 rounded-lg text-lg"
            onClick={handleSubmitOrder}
          >
            ยืนยันคำสั่งซื้อ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
