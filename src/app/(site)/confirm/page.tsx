//app/(site)/confirm

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2"; // ✅ นำเข้า SweetAlert2
import Image from "next/image";
import { useUser } from "../../components/Usercontext"; // เปลี่ยน path ตามจริง
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
  shop_name: string;  // ✅ เพิ่ม shop_name
  item_name?: string;
  options?: OptionSelection[]; // ✅ ใช้ options เท่านั้น
}

// กำหนดประเภท OptionSelection ให้แน่ใจว่า group_id เป็น number
interface OptionSelection {
  option_name: string;
  group_id: number; // กำหนดเป็น number
  selected_items: string[];
}

const ConfirmationPage = () => {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const [shopId, setShopId] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [deliveryType, setDeliveryType] = useState(""); // ทำให้เริ่มต้นเป็นค่าว่าง
  const { user } = useUser(); // ✅ ดึงข้อมูล user
  const [outOfStockAction, setOutOfStockAction] = useState(""); // ทำให้เริ่มต้นเป็นค่าว่าง

  const [paymentMethod, setPaymentMethod] = useState(""); // ทำให้เริ่มต้นเป็นค่าว่าง
  const { cartItems, setCartItems } = useCart(); // ✅ เพิ่ม setCartItems ให้ใช้งานได้
const shopName = cartItems.length > 0 ? cartItems[0].shop_name : "";

  const shopIdFromCart = cartItems.length > 0 ? cartItems[0].shop_id : null;

  const isOrderValid =
    cartItems.length > 0 &&
    deliveryType !== "" &&
    paymentMethod !== "" &&
    outOfStockAction !== "";

  console.log("🛒 Cart Items:", cartItems);
  console.log("✅ isOrderValid:", isOrderValid);

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

  interface OptionSelection {
    option_name: string;
    group_id: number;
    selected_items: number[]; // เปลี่ยนเป็น number[]
  }

  // ฟังก์ชันการอัปเดตตัวเลือกในตะกร้า
  const handleOptionChange = (option: OptionSelection, cartId: string) => {
    // ค้นหาสินค้าในตะกร้าที่ต้องการอัปเดต
    const updatedCart = cartItems.map((item) => {
      if (item.cart_id === cartId) {
        // อัปเดตข้อมูล options
        item.options = [...(item.options || []), option];
      }
      return item;
    });

    setCartItems(updatedCart);

    // บันทึกข้อมูลที่อัปเดตลงใน localStorage
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedPhone = localStorage.getItem("phoneNumber");
    if (storedUserName) setUserName(storedUserName);
    if (storedPhone) setPhone(storedPhone);
    console.log("👤 User Name:", storedUserName);
    console.log("📞 Phone:", storedPhone);
  }, []);

  useEffect(() => {
    if (!shopId && cartItems.length > 0) {
      setShopId(cartItems[0].shop_id);
      console.log("🏪 Shop ID set:", cartItems[0].shop_id);
    }
  }, [cartItems, shopId]);

  useEffect(() => {
    if (orderStatus) {
      console.log("📦 Order Status Updated:", orderStatus);
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

 
  const handleSubmitOrder = () => {
    console.log("📝 Checking required fields before sending order...");
    
    // ดึง Token จาก localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("เกิดข้อผิดพลาด", "กรุณาเข้าสู่ระบบก่อนทำรายการ", "error");
      return;
    }
  
    // ตรวจสอบว่าในตะกร้ามีสินค้าหรือไม่
    if (!cartItems || cartItems.length === 0) {
      Swal.fire("เกิดข้อผิดพลาด", "ไม่มีสินค้าในตะกร้า", "error");
      return;
    }
  
    // ตรวจสอบการเลือกตัวเลือกต่างๆ
    if (deliveryType === "" || paymentMethod === "" || outOfStockAction === "") {
      Swal.fire("เกิดข้อผิดพลาด", "กรุณาเลือกทุกตัวเลือก", "error");
      return;
    }
    // ดึงชื่อร้านจากสินค้าในตะกร้า (สมมติว่าทุกรายการมาจากร้านเดียวกัน)
    const shopName = cartItems.length > 0 ? cartItems[0].shop_name : "";

    // คำนวณ totalAmount
    const totalAmount = cartItems.reduce((total, item) => total + item.price, 0);
  
    // สร้างข้อมูลคำสั่งซื้อ (ส่งแค่ข้อมูลไปที่หน้า QR)
    const orderData = {
      customer_name: userName,
      customer_phone: phone,
      shop_id: shopId,
      deliveryType, // ตรวจสอบให้ส่งค่านี้
      paymentMethod, // ตรวจสอบให้ส่งค่านี้
      out_of_stock_action: outOfStockAction, // ตรวจสอบให้ส่งค่านี้
      items: cartItems.map((item) => ({
        cart_id: item.cart_id,
        item_id: item.item_id,
        
        menu_name: item.menu_name,
        menu_image: item.menu_image,
        price: item.price,
        quantity: item.quantity,
        shop_id: item.shop_id,
        note: item.note || "",
        options: item.options || [],
      })),
      totalAmount,
    };
  
    console.log("📤 Sending Order Data:", orderData);
  
    // คำนวณ URL สำหรับไปยังหน้า QR
    const qrUrl = `/qr?shop_id=${shopId}&shop_name=${encodeURIComponent(shopName)}&amount=${totalAmount}&orderId=${Math.random().toString(36).substring(7)}&deliveryType=${deliveryType}&paymentMethod=${paymentMethod}&outOfStockAction=${outOfStockAction}`;
  
    // เปลี่ยนไปยังหน้า QR
    router.push(qrUrl);
  
    Swal.fire("สำเร็จ!", "คำสั่งซื้อถูกส่งแล้ว", "success");
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
      <div className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
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
                <p className="font-normal">{item.menu_name}</p>

                {/* แสดงหมายเหตุของลูกค้า ถ้ามี */}
                {item.note && (
                  <p className="text-sm text-red-500">* {item.note}</p>
                )}
              </div>

              {/* ปุ่มแก้ไข  */}
              <div className="flex justify-end gap-2 mt-1">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  onClick={() =>
                    router.push(
                      `/detail?menu_id=${
                        item.item_id
                      }&menu_name=${encodeURIComponent(
                        item.menu_name
                      )}&quantity=${item.quantity}&note=${encodeURIComponent(
                        item.note || ""
                      )}`
                    )
                  }
                >
                  แก้ไข
                </button>

                {/* ปุ่มลบ */}
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
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
  onChange={(e) => {
    setOutOfStockAction(e.target.value);
    console.log("🛑 out_of_stock_action updated:", e.target.value);
  }}
>
  <option value="" disabled hidden>
    เลือก
  </option>
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
