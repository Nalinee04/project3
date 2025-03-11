//site/detail

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "../../components/CartContext";
import { ArrowLeft } from "lucide-react";

interface Menu {
  menu_id: number;
  shop_id: number;
  menu_name: string;
  price: string;
  menu_image: string;
  shop_name: string;
}

interface OptionGroup {
  group_id: number;
  group_name: string;
  is_required: number;
  max_select: number;
  options: OptionItem[];
}

interface OptionItem {
  item_id: number;
  item_name: string;
  add_price: string;
}

const MenuDetailPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const menu_id = searchParams.get("menu_id");

  const [menu, setMenu] = useState<Menu | null>(null);
  const [options, setOptions] = useState<OptionGroup[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, number[]>
  >({});

  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [basePrice, setBasePrice] = useState<number>(0); // ราคาตั้งต้นของเมนู
  const [totalPrice, setTotalPrice] = useState<number>(0); // ราคาหลังรวม option

  useEffect(() => {
    if (!menu_id) return;

    // ✅ ดึงค่าที่เคยแก้ไขไว้จาก localStorage
    const storedItem = localStorage.getItem("editItem");
    if (storedItem) {
      const editItem = JSON.parse(storedItem);
      console.log("📌 editItem จาก localStorage:", editItem); // ตรวจสอบค่าที่โหลด

      if (editItem.item_id.toString() === menu_id.toString()) {
        setQuantity(editItem.quantity); 
        setNote(editItem.note || ""); 

        // ตั้งค่าตัวเลือกที่เคยเลือกไว้
        const restoredOptions: Record<number, number[]> = {};
        editItem.options?.forEach(
          (group: { group_id: number; selected_items: number[] }) => {
            restoredOptions[group.group_id] = group.selected_items;
          }
        );

        console.log("✅ ตัวเลือกที่โหลดจาก localStorage:", restoredOptions);

        setSelectedOptions(restoredOptions);

        // ❌ ปิดการลบ localStorage ชั่วคราวก่อน
        // setTimeout(() => {
        //   localStorage.removeItem("editItem");
        // }, 500);
      }
    }

    const fetchMenu = async () => {
      try {
        const res = await fetch(`/api/menue/detail?menu_id=${menu_id}`);
        const data = await res.json();
        console.log("📌 เมนูที่โหลดจาก API:", data);

        if (res.ok) {
          setMenu(data.menu);
          setOptions(data.options);
          setBasePrice(parseFloat(data.menu.price || "0"));
          console.log("✅ ค่าของ menu:", data.menu); // 🔥 เช็กว่ามี restaurant_name หรือไม่
        } else {
          console.error("❌ API Error:", data.error);
        }
      } catch (error) {
        console.error("❌ Failed to fetch menu details:", error);
      }
    };

    fetchMenu();
  }, [menu_id]);


  useEffect(() => {
    let optionPrice = Object.keys(selectedOptions).reduce((sum, groupId) => {
      return (
        sum +
        selectedOptions[parseInt(groupId)].reduce((optSum, itemId) => {
          const item = options
            .find((group) => group.group_id === parseInt(groupId))
            ?.options.find((opt) => opt.item_id === itemId);
          return optSum + (item ? parseFloat(item.add_price || "0") : 0);
        }, 0)
      );
    }, 0);

    setTotalPrice((basePrice + optionPrice) * quantity);
  }, [basePrice, selectedOptions, quantity, options]);

  const areOptionsSelected = () => {
    return options.every((group) => {
      if (group.is_required) {
        return selectedOptions[group.group_id]?.length > 0;
      }
      return true;
    });
  };

  const isButtonDisabled = !areOptionsSelected(); // ย้ายมาหลังจากฟังก์ชันนี้ถูกประกาศ

  const handleSelectOption = (
    group_id: number,
    item_id: number,
    add_price: string
  ) => {
    setSelectedOptions((prev) => {
      const currentSelection = prev[group_id] || [];
      const maxSelect =
        options.find((group) => group.group_id === group_id)?.max_select || 0;
      let newSelection = [...currentSelection];

      if (currentSelection.includes(item_id)) {
        newSelection = currentSelection.filter((id) => id !== item_id);
      } else if (currentSelection.length < maxSelect) {
        newSelection.push(item_id);
      }

      return { ...prev, [group_id]: newSelection };
    });

    // ✅ ตรวจสอบว่า add_price ทำงานถูกต้อง
    console.log(`✅ เลือก option: item_id=${item_id}, add_price=${add_price}`);
  };

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const { addToCart } = useCart(); // ✅ ประกาศ Hook ก่อนใช้

  const handleAddToCart = () => {
    if (!menu || isAdding || isLoading) return;
    setIsAdding(true);
    setIsLoading(true);

    const cartItem = {
      cart_id: Date.now().toString(),
      item_id: menu.menu_id.toString(),
      menu_name: menu.menu_name,
      price: totalPrice,
      menu_image: menu.menu_image,
      quantity,
      shop_id: menu.shop_id.toString(),
      shop_name: menu.shop_name, // ✅ เพิ่มตรงนี้
      options: Object.keys(selectedOptions || {}).map((groupId) => ({
        group_id: parseInt(groupId),
        selected_items: selectedOptions[parseInt(groupId)] ?? [],
      })),
      note,
    };
    


    // เพิ่มสินค้าไปที่ตะกร้า
    addToCart(cartItem); // ✅ ใช้งานได้ถูกต้อง

    setTimeout(() => {
      setIsAdding(false);
      setIsLoading(false);
    }, 1000);
  };

  if (!menu) {
    return null;
  }
  // ตรวจสอบค่าตัวแปรก่อน return
  console.log("🚀 isButtonDisabled:", isButtonDisabled);
  console.log("📦 totalPrice:", totalPrice);
  console.log("⚙️ ตัวเลือกสินค้า:", options);
  console.log("🛒 จำนวนสินค้า:", quantity);

  return (
    <div className="relative">
      {/* ปุ่มย้อนกลับ */}
      <button
        className="absolute top-3 left-3 bg-black/50 rounded-full p-2 shadow-lg border border-white/20 
               hover:bg-black/70 transition-all z-50"
        onClick={() => {
          const prevPage = sessionStorage.getItem("prevPage");

          if (prevPage === "detail") {
            sessionStorage.setItem("prevPage", "menu");
            router.replace(`/menus/${menu.shop_id}`); // 🔥 ใช้ replace() แทน push()
          } else {
            sessionStorage.removeItem("prevPage"); // 🧹 ล้างค่าที่อาจทำให้ย้อนผิดพลาด
            router.back();
          }
        }}
      >
        <ArrowLeft className="h-6 w-6 text-white" />
      </button>

      {/* Container สำหรับรูปภาพ */}
      <div className="relative w-full h-60">
        <Image
          src={menu.menu_image}
          alt={menu.menu_name}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>

      {/* เนื้อหา */}
      <div className="p-4">
        <div className="flex items-center justify-between mt-2 border-b pb-6">
          <h2 className="text-2xl font-semibold">{menu.menu_name}</h2>
          <div className="text-right min-w-[60px]">
            <p className="text-xl text-black font-semibold">
              {basePrice.toFixed(0)}
            </p>
          </div>
        </div>

        {/* ตัวเลือกเสริม */}
        <div className="mt-6">
          {options.map((group: OptionGroup) => (
            <div key={group.group_id} className="mb-4">
              <h3 className="text-lg font-semibold">{group.group_name}</h3>
              <div className="space-y-2 mt-2">
                {group.options.map((item) => (
                  <label
                    key={item.item_id}
                    className="flex items-center justify-between p-2 border rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="mr-2 w-5 h-5 accent-yellow-500 text-white border-2 border-gray-300 rounded-md"
                      checked={
                        selectedOptions[group.group_id]?.includes(
                          item.item_id
                        ) || false
                      }
                      onChange={() =>
                        handleSelectOption(
                          group.group_id,
                          item.item_id,
                          item.add_price
                        )
                      }
                    />
                    <span className="flex-1">{item.item_name}</span>
                    <span className="text-gray-400">
                      +{parseFloat(item.add_price || "0").toFixed(0)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* หมายเหตุถึงร้าน */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">หมายเหตุถึงร้านอาหาร</h3>
          <Textarea
            placeholder="ระบุรายละเอียดคำขอ (ถ้ามี)"
            onClick={() => setIsModalOpen(true)}
            className="mt-2 w-full p-2 border rounded-lg"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Modal สำหรับกรอกหมายเหตุ */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
  <DialogContent className="p-6 rounded-xl bg-white">
    <DialogHeader className="border-b pb-2">
      <DialogTitle className="text-lg font-semibold text-center">
        หมายเหตุถึงร้านอาหาร
      </DialogTitle>
    </DialogHeader>
    
    <div className="mt-4">
      <p className="text-sm text-gray-500">ไม่จำเป็นต้องระบุ</p>
      <Textarea
        placeholder="ระบุรายละเอียดคำขอ (ขึ้นอยู่กับดุลยพินิจของร้าน)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="mt-2 w-full p-3 border rounded-lg"
      />
    </div>

    <DialogFooter className="mt-4 flex justify-center">
      <Button
        onClick={() => setIsModalOpen(false)}
        className="w-2/3 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold"
      >
        ยืนยัน
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>


        {/* ส่วนที่ต้องการเพิ่มเส้นคั่น */}
        <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-lg flex flex-col items-center border-t border-gray-300">
          {/* ปุ่มเพิ่ม/ลดจำนวน */}
          <div className="flex items-center space-x-4 mb-2">
            <Button
              onClick={handleDecrease}
              className="bg-white text-black text-2xl font-bold px-4 py-2 rounded-lg 
             active:bg-yellow-600 focus:bg-yellow-500 focus:outline-none transition-colors"
            >
              -
            </Button>

            <span className="text-lg font-semibold">{quantity}</span>

            <Button
              onClick={handleIncrease}
              className="bg-white text-black text-2xl font-bold px-4 py-2 rounded-lg 
             active:bg-yellow-600 focus:bg-yellow-500 focus:outline-none transition-colors"
            >
              +
            </Button>
          </div>

          {/* ปุ่มเพิ่มไปยังตะกร้า */}
          <Button
            onClick={handleAddToCart}
            className={`w-full ${
              isButtonDisabled
                ? "bg-gray-300"
                : "bg-yellow-400 hover:bg-yellow-400"
            } text-white font-normal py-4 text-lg rounded-lg flex items-center justify-center gap-2`}
            disabled={isButtonDisabled || isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="white"
                    d="M4 12a8 8 0 0116 0H4z"
                  ></path>
                </svg>
                <span>กำลังเพิ่ม...</span>
              </>
            ) : (
              <>เพิ่มไปยังตะกร้า - {totalPrice.toFixed(2)}</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuDetailPage;
