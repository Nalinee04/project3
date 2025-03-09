
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const RoleSelection = () => {
  const router = useRouter();

  const handleSelectRole = (role: string) => {
    localStorage.setItem("userRole", role);

    if (role === "customer") {
      router.push("/help"); // ลูกค้าไปหน้า Help
    } else if (role === "vendor") {
      router.push("/helpres"); // ร้านค้าไปหน้า HelpRes
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-center px-4">
      {/* ภาพตกแต่งด้านบน ขยายและขยับขึ้น */}
      <motion.img
        src="/images/homeres.gif" // **เปลี่ยนเป็นภาพจริงของคุณ**
        alt="Food Illustration"
        className="w-40 h-40 mb-6 mt-[-10vh]"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-gray-800 flex flex-col items-center justify-center max-w-md"
      >
        <h1 className="text-3xl font-bold mb-2">เลือกบทบาทของคุณ</h1>
        <p className="text-md mb-6 text-gray-600">
          กรุณาเลือกประเภทของคุณเพื่อเริ่มต้นใช้งานแอป
        </p>

        {/* ปุ่มเลือกบทบาท ปรับสีให้เหมือนเรฟ */}
        <div className="flex flex-col gap-4 w-full">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#FFCE00] text-black font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all w-48 flex justify-center items-center mx-auto gap-2"
            onClick={() => handleSelectRole("customer")}
          >
            <span>👤</span> ลูกค้า
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#F7A400] text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all w-48 flex justify-center items-center mx-auto gap-2"
            onClick={() => handleSelectRole("vendor")}
          >
            <span>🏪</span> ร้านค้า
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelection;
