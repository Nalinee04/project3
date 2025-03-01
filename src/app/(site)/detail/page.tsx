"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "../../components/CartContext";
import { ArrowLeft } from "lucide-react";

interface Menu {
  menu_id: number;
  shop_id: number;
  menu_name: string;
  price: string;
  menu_image: string;
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
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();
  const menu_id = searchParams.get("menu_id");

  const [menu, setMenu] = useState<Menu | null>(null);
  const [options, setOptions] = useState<OptionGroup[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: number[];
  }>({});
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [note, setNote] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);
  const { cartItems } = useCart(); // ✅ ดึงข้อมูลตะกร้า
  const [outOfStockAction, setOutOfStockAction] = useState("ติดต่อฉันเพื่อหาสินค้าแทน");
  const [restaurantNote, setRestaurantNote] = useState("");
  const shopId = cartItems.length > 0 ? cartItems[0].shop_id : null; // ✅ ดึง shop_id จากสินค้าชิ้นแรก

<button
  onClick={() => {
    console.log("🛒 ตะกร้าสินค้า:", cartItems); // ✅ ดูว่ามีสินค้าอะไรบ้าง

    if (cartItems.length === 0) {
      console.warn("⚠️ ตะกร้าว่างเปล่า!");
      return;
    }

    const shopId = cartItems[0].shop_id;
    console.log("🏪 คำนวณค่า Shop ID:", shopId); // ✅ เช็กค่า shop_id

    if (!shopId) {
      console.error("❌ ไม่มี Shop ID! ไม่ Redirect");
      return;
    }

    const queryString = cartItems
      .map((item) => `id=${item.id}&name=${encodeURIComponent(item.name)}&price=${item.price}&quantity=${item.quantity}&image=${encodeURIComponent(item.image)}`)
      .join("&");

    const url = `/confirm?shop_id=${shopId}&${queryString}`;
    console.log("➡️ Redirecting to:", url);
    router.push(url);
  }}
>
  🛒 ตะกร้าสินค้า
</button>



useEffect(() => {
  if (!menu_id) return;

  const fetchMenu = async () => {
    try {
      console.log("🔄 กำลังโหลดเมนู:", menu_id);
      const res = await fetch(`/api/menue/detail?menu_id=${menu_id}`);
      const data = await res.json();

      console.log("📥 ข้อมูลที่ได้จาก API:", data);

      if (res.ok) {
        setMenu(data.menu);
        setOptions(data.options);
        setTotalPrice(parseFloat(data.menu.price || "0"));
      } else {
        console.error("❌ API Error:", data.error);
      }
    } catch (error) {
      console.error("❌ Failed to fetch menu details:", error);
    }
  };

  fetchMenu();
}, [menu_id]);


  const handleSelectOption = (
    group_id: number,
    item_id: number,
    add_price: string
  ) => {
    const addPriceNumber = parseFloat(add_price || "0");

    setSelectedOptions((prev) => {
      const currentSelection = prev[group_id] || [];
      const maxSelect =
        options.find((group) => group.group_id === group_id)?.max_select || 0;

      let newSelection = [...currentSelection];
      let newTotalPrice = totalPrice;

      if (currentSelection.includes(item_id)) {
        newSelection = currentSelection.filter((id) => id !== item_id);
        newTotalPrice -= addPriceNumber;
      } else {
        if (currentSelection.length < maxSelect) {
          newSelection.push(item_id);
          newTotalPrice += addPriceNumber;
        }
      }

      setTotalPrice(newTotalPrice);
      return { ...prev, [group_id]: newSelection };
    });
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
    setTotalPrice((prev) => prev + parseFloat(menu?.price || "0"));
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      setTotalPrice((prev) => prev - parseFloat(menu?.price || "0"));
    }
  };

  const areOptionsSelected = () => {
    return options.every((group) => {
      if (group.is_required) {
        return selectedOptions[group.group_id]?.length > 0;
      }
      return true;
    });
  };

  const isButtonDisabled = !areOptionsSelected();
  console.log("⚠️ ปุ่มเพิ่มตะกร้า Disabled:", isButtonDisabled);
  

  const handleAddToCart = () => {
    if (!menu || isAdding) return;
  
    console.log("🛒 กำลังเพิ่มสินค้า:", menu.menu_name);
    console.log("🏪 shop_id ของสินค้า:", menu.shop_id);
    console.log("📦 ตัวเลือกที่เลือก:", selectedOptions);
    console.log("🛍 ตะกร้าปัจจุบัน:", cartItems);
  
    if (!menu.shop_id) {
      console.error("❌ ไม่มี shop_id! ไม่สามารถเพิ่มลงตะกร้าได้");
      return;
    }
  
    const existingShopId = cartItems.length > 0 ? cartItems[0].shop_id : null;
  
    if (existingShopId && existingShopId !== menu.shop_id) {
      console.error("❌ ไม่สามารถเพิ่มสินค้าจากร้านต่างกันในตะกร้าได้");
      alert("คุณไม่สามารถเพิ่มสินค้าจากร้านอื่นในตะกร้าเดียวกันได้");
      return;
    }
  
    setIsAdding(true);
  
    const cartItem = {
      id: menu.menu_id.toString(),
      name: menu.menu_name,
      price: totalPrice,
      image: menu.menu_image,
      quantity,
      shop_id: menu.shop_id,
      options: Object.keys(selectedOptions || {}).map((groupId) => ({
        group_id: parseInt(groupId),
        selected_items: selectedOptions[parseInt(groupId)] ?? [],
      })),
      note,
    };
  
    addToCart(cartItem);
  
    setTimeout(() => {
      setIsAdding(false);
      console.log("✅ สินค้าถูกเพิ่มลงตะกร้าแล้ว:", cartItem);
      alert("เพิ่มสินค้าในตะกร้าเรียบร้อย!");
    }, 300);
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
            router.push(`/menus/${menu.shop_id}`);
          } else {
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
              {totalPrice.toFixed(0)}
            </p>
          </div>
        </div>

        {/* ตัวเลือกเสริม */}
        <div className="mt-6">
          {options.map((group) => (
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
            className="mt-2 w-full p-2 border rounded-lg"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* ปุ่มเพิ่ม/ลดจำนวน */}
        <div className="mt-4 flex items-center justify-center space-x-4">
          <Button
            onClick={handleDecrease}
            className="bg-white text-yellow-500 text-2xl font-bold px-4 py-2 rounded-lg"
          >
            -
          </Button>
          <span className="text-lg font-semibold">{quantity}</span>
          <Button
            onClick={handleIncrease}
            className="bg-white text-yellow-500 text-2xl font-bold px-4 py-2 rounded-lg"
          >
            +
          </Button>
        </div>

        {/* ปุ่มเพิ่มไปยังตะกร้า */}
        <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-lg z-50">

          <Button
            onClick={handleAddToCart}
            className={`w-full ${
              isButtonDisabled
                ? "bg-gray-300"
                : "bg-yellow-400 hover:bg-yellow-400"
            } text-white font-normal py-4 text-lg rounded-lg`}
            disabled={isButtonDisabled}
          >
            เพิ่มไปยังตะกร้า - {totalPrice.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuDetailPage;
