import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartContext"; // ใช้งาน useCart
import { useRouter } from "next/navigation"; // ใช้ useRouter เพื่อ redirect
import { useEffect, useMemo } from "react";

const Cart = () => {
  const { cartItems, removeFromCart } = useCart(); // ดึงข้อมูลตะกร้าและฟังก์ชัน removeFromCart
  const router = useRouter(); // ใช้ redirect

  // ✅ Log เฉพาะกรณีที่มีสินค้าในตะกร้า
  useEffect(() => {
    if (cartItems.length > 0) {
      console.log("📌 สินค้าในตะกร้า (Cart.tsx):", cartItems);
    }
  }, [cartItems]);

  // ✅ ใช้ useMemo เพื่อป้องกันคำนวณ query ใหม่ทุกครั้ง
  const query = useMemo(() => {
    return cartItems
      .map((item) => {
        const itemName = item.name || "ไม่มีชื่อ";
        const itemImage = item.image || "";
        const shopId = item.shop_id || null;

        return `cart_id=${encodeURIComponent(item.cart_id)}&name=${encodeURIComponent(
          itemName
        )}&price=${item.price}&quantity=${item.quantity}&image=${encodeURIComponent(
          itemImage
        )}&shop_id=${shopId}`;
      })
      .join("&");
  }, [cartItems]);

  const handleConfirmOrder = () => {
    console.log("🛒 ตรวจสอบสินค้าในตะกร้า:", cartItems);

    if (cartItems.length === 0) {
      router.push("/cart-empty"); // ถ้าตะกร้าว่างให้ไปหน้า cart-empty
      return;
    }

    console.log("🔗 Query String:", query);
    router.push(`/confirm?${query}`);
  };

  ;

  return (
    <div>
     

      {/* ไอคอนตะกร้าบน Header */}
      <div className="cart-icon-container relative cursor-pointer" onClick={handleConfirmOrder}>
        <ShoppingCart className="h-6 w-6" />
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {cartItems.length}
          </span>
        )}
      </div>
    </div>
  );
};

export default Cart;
