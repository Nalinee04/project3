"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "../../components/CartContext";

export default function QRPage() {
  const { cartItems } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const shopId = searchParams.get("shop_id");
  const amount = searchParams.get("amount");

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [isValidSlip, setIsValidSlip] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [Tesseract, setTesseract] = useState<any>(null);

  useEffect(() => {
    import("tesseract.js").then((mod) => setTesseract(mod));
  }, []);

  useEffect(() => {
    if (shopId) {
      fetch(`/api/qr?shop_id=${shopId}`)
        .then((res) => res.json())
        .then((data) => {
          setQrCode(data.qr_code);
          setAccountName(data.account_name);
        });
    }
  }, [shopId]);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  ;

  const verifySlip = async (file: File) => {
    if (!Tesseract) return;
    setReceipt(file);
    setLoading(true);

    try {
      const { data } = await Tesseract.recognize(file, "eng+tha", { psm: 6 });
      let text = data.text.replace(/\s+/g, "");
      console.log("🔍 OCR อ่านได้:", text);

      const amountMatch = text.match(/(\d+\.\d{2})บาท/);
      let slipAmount = amountMatch ? parseFloat(amountMatch[1]) : null;
      console.log("💰 จำนวนเงินที่อ่านได้:", slipAmount);

      const validText = /โอนเงิน|ชำระเงิน|ยอดเงิน|บาท/.test(text);
      const expectedAmount = parseFloat(amount || "0");

      if (validText && slipAmount !== null && slipAmount === expectedAmount) {
        setIsValidSlip(true);
      } else {
        alert("❌ จำนวนเงินในสลิปไม่ตรงกับที่ต้องชำระ กรุณาอัปโหลดสลิปที่ถูกต้อง");
        setIsValidSlip(false);
      }
    } catch (error) {
      console.error("OCR Error:", error);
      alert("❌ เกิดข้อผิดพลาดในการอ่านสลิป กรุณาลองใหม่");
      setIsValidSlip(false);
    }
    setLoading(false);
  };

  const handleConfirmPayment = async () => {
    if (!receipt) return alert("❌ กรุณาอัปโหลดสลิป");
    if (!cartItems || cartItems.length === 0) return alert("❌ กรุณาเลือกสินค้าก่อนทำการสั่งซื้อ");
  
    const slipBase64 = await convertFileToBase64(receipt);
  
    const orderData = {
      order_number: Date.now().toString(),
      customer_name: session?.user?.name || "ลูกค้าไม่ระบุ",
      shop_id: shopId,
      deliveryTime: null,
      note: "Your note here",
      slip: slipBase64,
      items: cartItems.map((item) => ({
        menu_name: item.name,
        price: item.price,
        quantity: item.quantity,
        menu_image: item.image,
      })),
    };
  
    console.log("📦 Data ส่งไป API:", orderData);
  
    try {
      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(orderData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ API Error:", errorData);
        throw new Error("Failed to create order");
      }
  
      const result = await response.json();
      console.log("✅ Order saved successfully:", result);
      router.push("/success");
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };
  

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
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
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-xl font-bold text-gray-800 text-center">ข้อมูลการชำระเงิน</h1>
        <div className="flex flex-col items-center my-4">
          <p className="text-gray-600 text-sm">ยอดชำระเงินทั้งหมด</p>
          <p className="text-3xl font-bold text-red-500">฿{amount}</p>
        </div>
        {qrCode && (
          <div className="flex justify-center my-4">
            <img src={qrCode} alt="QR Code" className="w-64 h-64 border rounded-xl shadow-md" />
          </div>
        )}
        {accountName && (
          <p className="text-gray-700 font-semibold text-center mt-2">ชื่อบัญชี: {accountName}</p>
        )}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl shadow-inner w-full">
          <p className="text-center text-gray-600 font-semibold">แนบสลิปโอนเงิน</p>
          <label className="flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-400 rounded-xl py-4 mt-2 cursor-pointer hover:border-gray-600">
            <FaUpload className="text-gray-500 text-2xl" />
            <span className="text-gray-500 mt-2">{receipt ? receipt.name : "อัพโหลดสลิป"}</span>
            <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && verifySlip(e.target.files[0])} />
          </label>
        </div>
        <button className={`mt-4 text-white text-lg font-semibold py-3 rounded-xl w-full shadow-md ${isValidSlip ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"}`} disabled={!isValidSlip} onClick={handleConfirmPayment}>
          ✅ ยืนยันชำระเงิน
        </button>
      </div>
    </div>
  );
}
