//app/cart-emtry/page

"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

const CartEmpty = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header Bar */}
      <div className="bg-yellow-400 p-4 flex items-center">
        <button onClick={() => router.back()} className="p-2">
          <ArrowLeft className="h-6 w-6 text-black" />
        </button>
        <h1 className="text-black text-lg font-semibold mx-auto">
          รถเข็นของคุณ
        </h1>
      </div>

      {/* Empty Cart Content */}
      <div className="flex flex-col items-center justify-start flex-grow bg-white px-4 pt-10">
        {/* การ์ดที่ต้องการดันขึ้นไป */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-none text-center min-h-[50vh] flex flex-col justify-center">

          <h2 className="text-xl font-bold text-gray-900">
            ขออภัย! รถเข็นของคุณว่างเปล่า
          </h2>
          <Image
            src="/images/ตะกร้า.webp"
            alt="Empty Cart"
            width={250}
            height={250}
            className="mx-auto"
          />
        </div>

        <button
          onClick={() => router.push("/home")}
          className="w-full max-w-lg py-2 border border-yellow-500 text-yellow-500 rounded-lg font-semibold mt-4 hover:bg-yellow-500 hover:text-white transition"
        >
          เริ่มสั่งซื้อ
        </button>
      </div>
    </div>
  );
};

export default CartEmpty;
