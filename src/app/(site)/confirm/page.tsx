"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import MapComponent from "@/app/components/Map/LongdoMap";
import SweetAlert from "@/components/ui/sweetAlert";
import Notification from "@/components/ui/Notification";
import OrderHistory from "@/components/ui/OrderHistory";

interface CartItem {
  item_id: string;
  product_name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface Address {
  province: string;
  district: string;
  subDistrict: string;
  postalCode: string;
  additional: string;
}

const ConfirmationPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentSlip, setPaymentSlip] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isRaining, setIsRaining] = useState(false);
  const [pinnedAddress, setPinnedAddress] = useState<string | null>(null);
  const [showAddressConfirmation, setShowAddressConfirmation] = useState(false);
  const [additionalAddress, setAdditionalAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);

  const [shippingAddress, setShippingAddress] = useState<Address>({
    province: "",
    district: "",
    subDistrict: "",
    postalCode: "",
    additional: "",
  });

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

    if (queryId.length > 0 && queryName.length > 0) {
      const items: CartItem[] = [];
      for (let i = 0; i < queryId.length; i++) {
        items.push({
          item_id: queryId[i],
          product_name: queryName[i],
          price: parseFloat(queryPrice[i]),
          quantity: Math.max(parseInt(queryQuantity[i]), 1),
          image_url: queryImage[i],
        });
      }
      setCartItems(items);
    }
  }, [searchParams]);

  const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        alert("กรุณาอัปโหลดไฟล์ภาพเท่านั้น");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("ขนาดไฟล์ต้องไม่เกิน 2MB");
        return;
      }
      setPaymentSlip(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedItems = cartItems.filter((item) => item.item_id !== itemId);
    setCartItems(updatedItems);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedItems = cartItems.map((item) =>
      item.item_id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
  };

  const confirmAddress = () => {
    setShowAddressConfirmation(false);
    setShippingAddress((prev) => ({
      ...prev,
      additional: additionalAddress.trim(),
    }));
  };

  const handleSubmitOrder = async () => {
    if (!pinnedAddress || pinnedAddress.trim() === "") {
      SweetAlert(false, () => {
        alert("กรุณากรอกที่อยู่ในการจัดส่ง");
      });
      return;
    }

    const { province, district, subDistrict, postalCode } = shippingAddress;

    if (
      !province ||
      !district ||
      !subDistrict ||
      !postalCode ||
      !province.trim() ||
      !district.trim() ||
      !subDistrict.trim() ||
      !postalCode.trim()
    ) {
      SweetAlert(false, () => {
        alert("กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน");
      });
      return;
    }

    if (cartItems.length === 0) {
      SweetAlert(false, () => {
        alert("ไม่มีสินค้าในตะกร้า");
      });
      return;
    }

    const completeShippingAddress = `${pinnedAddress || "ไม่ระบุที่อยู่"}, ${
      shippingAddress.additional.trim() || ""
    }`.trim();
    const finalShippingAddress = completeShippingAddress || "ไม่ระบุที่อยู่";

    if (!finalShippingAddress) {
      SweetAlert(false, () => {
        alert("กรุณากรอกที่อยู่ในการจัดส่งให้ครบถ้วน");
      });
      return;
    }

    if (!userName) {
      SweetAlert(false, () => {
        alert("กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ");
      });
      return;
    }
    console.log(isRaining);
    SweetAlert(isRaining, async () => {
      const order = {
        orderNumber: `Task-${Date.now()}`,
        customer_name: userName,
        items: cartItems,
        status: "Pending",
        shipping_address: finalShippingAddress,
        is_rainy: isRaining,
      };

      const token = localStorage.getItem("token");
      if (!token) {
        SweetAlert(false, () => {
          alert("กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ");
        });
        return;
      }

      try {
        setIsLoading(true);
        console.log("Order Details:", order);

        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(order),
        });

        if (!response.ok) {
          throw new Error("Failed to place order");
        }

        const data = await response.json();
        console.log("Order successful:", data);

        // อัปเดตประวัติการสั่งซื้อ
        setOrderHistory((prev) => {
          if (!prev.some((ord) => ord.orderNumber === data.order.orderNumber)) {
            return [...prev, data.order];
          }
          return prev;
        });

        setNotification("คำสั่งซื้อของคุณได้ถูกส่งเรียบร้อยแล้ว");
        // setCartItems([]); // ล้างตะกร้าหลังการสั่งซื้อ
        setPaymentSlip(null);
        setPreviewImage(null);
        setShippingAddress({
          province: "",
          district: "",
          subDistrict: "",
          postalCode: "",
          additional: "",
        });
        router.push("/success"); // เปลี่ยนเส้นทางไปยังหน้าสำเร็จ
      } catch (error) {
        console.error("Error:", error);
        setError("ไม่สามารถดำเนินการตามคำสั่งได้ กรุณาลองอีกครั้ง");
      } finally {
        setIsLoading(false);
      }
    });
  };

  const handlePinAddress = (address: string, addressDetails: Address) => {
    setPinnedAddress(address);
    setShippingAddress({
      ...shippingAddress,
      province: addressDetails.province,
      district: addressDetails.district,
      subDistrict: addressDetails.subDistrict || "",
      postalCode: addressDetails.postalCode || "",
    });
    setShowAddressConfirmation(true);
  };

  const handleWeatherCheck = (isRain: boolean) => {
    setIsRaining(isRain);
    console.log("Updated isRaining:", isRain); // Log the updated value of isRaining
    if (isRain) {
        console.log("ขณะนี้มีฝนตก");
    } else {
        console.log("ขณะนี้ไม่มีฝนตก");
    }
};


  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
      <OrderHistory orders={orderHistory} />

      <div className="p-6 bg-white rounded-lg shadow-md">
        <MapComponent onPinAddress={handlePinAddress}  onWeatherCheck={handleWeatherCheck} />

        {showAddressConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-lg font-semibold">ที่อยู่ที่ถูกเลือก</h2>
              <p>{pinnedAddress}</p>
              <textarea
                placeholder="รายละเอียดเพิ่มเติม"
                className="border p-2 rounded w-full"
                onChange={(e) => setAdditionalAddress(e.target.value)}
                value={additionalAddress}
              />
              <div className="flex justify-between mt-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowAddressConfirmation(false)}
                >
                  ยกเลิก
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={confirmAddress}
                >
                  ยืนยันที่อยู่
                </button>
              </div>
            </div>
          </div>
        )}

        {/* รายการในตะกร้า */}
        <div className="border-b pb-4 my-4">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold mb-2">รายการ</h2>
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
                        handleQuantityChange(
                          item.item_id,
                          parseInt(e.target.value)
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
                    onClick={() => handleRemoveItem(item.item_id)}
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
          <h2 className="text-lg font-semibold mb-2">วิธีการชำระเงิน</h2>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              เงินสด
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="transfer"
                checked={paymentMethod === "transfer"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              โอนเงิน
            </label>
          </div>

          {paymentMethod === "transfer" && (
            <div>
              <label className="block mt-4">อัปโหลดสลิปการโอน:</label>
              <input type="file" accept="image/*" onChange={handleSlipUpload} />
              {previewImage && (
                <div className="mt-2">
                  <Image
                    src={previewImage}
                    alt="Payment Slip Preview"
                    width={200}
                    height={100}
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-500 text-white rounded-lg py-2 px-4"
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
