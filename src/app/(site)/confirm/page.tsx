"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2"; // ✅ นำเข้า SweetAlert2
import Image from "next/image";
import { useCart } from "../../components/CartContext";

import { QrCode } from "lucide-react";

interface CartItem {
  cart_id: string;
  item_id: string;
  menu_name: string;
  price: number;
  quantity: number;
  shop_id: string;
  menu_image: string;
  item_name?: string;
  note?: string;
  options?: OptionSelection[]; // ✅ ใช้ options เท่านั้น
}

interface OptionSelection {
  option_name: string; // ✅ ต้องแน่ใจว่ามี option_name
}

const ConfirmationPage = () => {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [restaurantNote, setRestaurantNote] = useState<string>(""); // เพิ่มการตั้งค่า note
  const [userName, setUserName] = useState<string | null>(null);
  const [shopId, setShopId] = useState<string | null>(null);
  const [deliveryType, setDeliveryType] = useState(""); // ทำให้เริ่มต้นเป็นค่าว่าง

  const [outOfStockAction, setOutOfStockAction] = useState(""); // ทำให้เริ่มต้นเป็นค่าว่าง

  const [paymentMethod, setPaymentMethod] = useState(""); // ทำให้เริ่มต้นเป็นค่าว่าง
  const { cartItems, setCartItems } = useCart(); // ✅ เพิ่ม setCartItems ให้ใช้งานได้
  const shopIdFromCart = cartItems.length > 0 ? cartItems[0].shop_id : null;

   // ดึงค่า note จาก localStorage เมื่อคอมโพเนนต์โหลด
   useEffect(() => {
    const savedNote = localStorage.getItem("orderNote");
    if (savedNote) {
      setRestaurantNote(savedNote); // ตั้งค่าที่ดึงมาใน state
      console.log("Note from localStorage:", savedNote); // ลองตรวจสอบค่าที่ดึงมา
    }
  }, []); // ดึงค่าเพียงครั้งเดียวเมื่อคอมโพเนนต์ถูกโหลด

  

  const isOrderValid =
    cartItems.length > 0 &&
    deliveryType !== "" &&
    paymentMethod !== "" &&
    outOfStockAction !== "";

  const showConfirmAlert = () => {
    Swal.fire({
      title: "ยืนยันการส่งคำสั่งซื้อใช่ไหม?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      reverseButtons: false,
      width: "300px",
      
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmitOrder();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "ยกเลิก",
          text: "คำสั่งซื้อของคุณถูกยกเลิก :)",
          icon: "error",
        });
      }
    });
  };

  const savedNote = localStorage.getItem("orderNote");
if (savedNote) {
  console.log("Note from localStorage:", savedNote);
  // ใช้ savedNote ในหน้า QR หรือหน้า confirm
}

  useEffect(() => {
    if (!shopId && cartItems.length > 0) {
      setShopId(cartItems[0].shop_id);
    }
  }, [cartItems, shopId]);

  useEffect(() => {
    if (orderStatus) {
      Swal.fire({
        title: "สถานะคำสั่งซื้อ",
        text: `สถานะปัจจุบัน: ${orderStatus}`,
        icon:
          orderStatus.includes("ล้มเหลว") || orderStatus.includes("ยกเลิก")
            ? "error"
            : "success",
      });
    }
  }, [orderStatus]); // ✅ Syntax ถูกต้องแล้ว

  const handleSubmitOrder = async () => {
    if (!cartItems || cartItems.length === 0) {
      Swal.fire("เกิดข้อผิดพลาด", "ไม่มีสินค้าในตะกร้า", "error");
      return;
    }

    if (
      deliveryType === "" ||
      paymentMethod === "" ||
      outOfStockAction === ""
    ) {
      Swal.fire("เกิดข้อผิดพลาด", "กรุณาเลือกทุกตัวเลือก", "error");
      return;
    }
  

    // เก็บ restaurantNote ลงใน localStorage
    localStorage.setItem("orderNote", restaurantNote);

    const totalAmount = cartItems.reduce(
      (total, item) => total + item.price,
      0
    );

    const qrUrl = `/qr?shop_id=${shopId}&amount=${totalAmount}`;
    console.log("Redirecting to:", qrUrl);
    router.push(qrUrl);
  };

  const handleRemoveItem = (cartId: string) => {
    if (!cartItems) return;

    const updatedCart = cartItems.filter((item) => item.cart_id !== cartId);
    setCartItems(updatedCart);

    if (updatedCart.length === 0) {
      router.push("/home");
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      {/* ปุ่มย้อนกลับ */}
      {cartItems.length > 0 && (
        <button
          className="fixed top-3 left-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
          onClick={() => router.back()} // ย้อนกลับไปหน้าก่อนหน้า
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
      <div className="p-4 bg-white rounded-lg shadow-md">
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
                    src={item.menu_image} // ✅ เปลี่ยนจาก image_url
                    alt={item.menu_name} // ✅ เปลี่ยนจาก product_name
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
                <p className="font-semibold">{item.menu_name}</p>

                {/* แสดงหมายเหตุของลูกค้า ถ้ามี */}
                {item.note && (
                  <p className="text-sm text-red-500">* {item.note}</p>
                )}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  onClick={() => router.push(`/detail?menu_id=${item.item_id}`)}
                >
                  แก้ไข
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm ml-4"
                  onClick={() => handleRemoveItem(item.cart_id)}
                >
                  ลบ
                </button>
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
            ฿{cartItems.reduce((total, item) => total + item.price, 0)}
          </span>
        </div>
        <div className="flex justify-between text-lg font-semibold border-t pt-4 mt-2">
          <span>รวมทั้งหมด</span>
          <span>
            ฿{cartItems.reduce((total, item) => total + item.price, 0)}
          </span>
        </div>
      </div>

      {/* UI เลือกประเภทการรับอาหาร */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-md font-semibold">เลือกประเภทการรับอาหาร</h3>
        <div
          className="mt-2 flex items-center gap-2 p-3 cursor-pointer"
          onClick={() => setDeliveryType("รับกลับบ้าน")}
        >
          <div
            className={`w-5 h-5 border-2 rounded-full flex items-center justify-center 
              ${
                deliveryType === "รับกลับบ้าน"
                  ? "border-yellow-500"
                  : "border-gray-300"
              }`}
          >
            {deliveryType === "รับกลับบ้าน" && (
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            )}
          </div>
          <span>รับกลับบ้าน</span>
        </div>
      </div>

      {/* UI เลือกวิธีการชำระเงิน */}
      <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-md font-semibold">เลือกวิธีการชำระเงิน</h3>
        <div
          className="mt-2 flex items-center gap-2 p-3 cursor-pointer"
          onClick={() => setPaymentMethod("คิวอาร์โค้ด")}
        >
          <div
            className={`w-5 h-5 border-2 rounded-full flex items-center justify-center 
              ${
                paymentMethod === "คิวอาร์โค้ด"
                  ? "border-yellow-500"
                  : "border-gray-300"
              }`}
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

      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md p-4">
        <button
          className={`w-full py-3 rounded-lg text-lg ${
            isOrderValid
              ? "bg-yellow-500 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={showConfirmAlert} // ⬅️ เรียก SweetAlert ก่อน
          disabled={!isOrderValid}
        >
          ยืนยันคำสั่งซื้อ
        </button>
        ;
      </div>
    </div>
  );
};

export default ConfirmationPage;
