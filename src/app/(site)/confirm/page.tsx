"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import SweetAlert from "@/components/ui/sweetAlert";
import Notification from "@/components/ui/Notification";

interface CartItem {
  item_id: string;
  product_name: string;
  price: number;
  quantity: number;
  image_url: string;
}

const ConfirmationPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentSlip, setPaymentSlip] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [shopQRCode, setShopQRCode] = useState<string | null>(null);

  const fetchUserData = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser.username);
    }
  };

  useEffect(() => {
    fetchUserData();

    const queryId = searchParams.getAll("id");
    const queryName = searchParams.getAll("name");
    const queryPrice = searchParams.getAll("price");
    const queryQuantity = searchParams.getAll("quantity");
    const queryImage = searchParams.getAll("image");

    console.log("Names:", queryName); // ตรวจสอบค่าที่ดึงมา
    console.log("Query Params:");
    console.log("ID:", queryId);
    console.log("Name:", queryName);
    console.log("Price:", queryPrice);
    console.log("Quantity:", queryQuantity);
    console.log("Image:", queryImage);

    if (queryId.length > 0 && queryName.length > 0) {
      const items: CartItem[] = [];
      for (let i = 0; i < queryId.length; i++) {
        items.push({
          item_id: queryId[i] || `item-${i}`,
          product_name: queryName[i] || "ไม่ทราบชื่อเมนู",
          price: parseFloat(queryPrice[i]) || 0,
          quantity: Math.max(parseInt(queryQuantity[i]) || 1, 1),
          image_url: queryImage[i] || "/default-food.png",
        });
      }
      setCartItems(items);
    }

    const shopId = searchParams.get("shopId");
    if (shopId) {
      const storedQRCode = localStorage.getItem(`qr_${shopId}`);
      setShopQRCode(storedQRCode || "/default-qr.png");
    }
  }, [searchParams]);

  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) {
      SweetAlert(false, () => alert("ไม่มีสินค้าในตะกร้า"));
      return;
    }

    if (!userName) {
      SweetAlert(false, () => alert("กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ"));
      return;
    }

    SweetAlert(true, async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push("/success"); // ไปหน้าสำเร็จ
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="border-b pb-4 my-4">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold mb-2">สรุปคำสั่งซื้อ</h2>
            <button
              className="text-sm text-blue-500"
              onClick={() => router.push("/home")}
            >
              เพิ่มรายการ
            </button>
          </div>

          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.item_id}
                className="grid grid-cols-3 grid-flow-row justify-between items-center border p-4 mb-2 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={item.image_url}
                    alt={item.product_name}
                    width={50}
                    height={50}
                    className="rounded-md h-10"
                  />
                  <div>
                    <p>{item.product_name}</p>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        setCartItems((prevItems) =>
                          prevItems.map((cartItem) =>
                            cartItem.item_id === item.item_id
                              ? {
                                  ...cartItem,
                                  quantity: parseInt(e.target.value),
                                }
                              : cartItem
                          )
                        )
                      }
                      className="w-16 text-center border rounded-lg"
                    />
                  </div>
                </div>
                <div className="text-center">฿{item.price}</div>
                <div className="text-right">
                  <button
                    className="text-red-500"
                    onClick={() =>
                      setCartItems((prev) =>
                        prev.filter((i) => i.item_id !== item.item_id)
                      )
                    }
                  >
                    ลบ
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>ไม่มีสินค้าในตะกร้า</p>
          )}
          <div className="text-right font-semibold">
            รวมทั้งหมด: ฿
            {cartItems.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            )}
          </div>
        </div>

        <div className="border-b pb-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">รายละเอียดการชำระเงิน</h2>
          <p>แสดง QR Code เฉพาะร้านค้าเพื่อชำระเงิน</p>
          {shopQRCode && (
            <div className="flex justify-center mt-4">
              <Image src={shopQRCode} alt="QR Code" width={200} height={200} />
            </div>
          )}
        </div>

        <div className="flex justify-center mt-4">
          <button
            className="bg-black text-white rounded-lg py-2 px-4"
            onClick={handleSubmitOrder}
          >
            สั่งซื้อ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
