import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCart } from './CartContext'; // ดึง useCart จาก CartContext

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart(); // ใช้ useCart เพื่อดึงฟังก์ชัน

  return (
    <Sheet>
      <SheetTrigger>
        <ShoppingCart />
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full p-4">
        <SheetHeader>
          <SheetTitle>รายการอาหาร</SheetTitle>
          <SheetDescription>อาหารทั้งหมด</SheetDescription>
        </SheetHeader>

        <Separator />
        <ScrollArea className="rounded-md border p-4">
          <div className="flex flex-col gap-4 flex-grow">
            {/* แสดงรายการสินค้าในตะกร้า */}
            {cartItems.map((item) => (
              <div key={item.id}>
                <div className="flex items-center justify-between">
                  <div className="w-20 h-20 relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="border-solid border-2 rounded-full"
                      sizes="(min-width: 800px) 50vw, 100vw"
                    />
                  </div>
                  <span>{item.name}</span>

                  {/* Input สำหรับเปลี่ยนจำนวนสินค้า */}
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value))
                    }
                    className="w-16 text-center border-solid border-2 rounded-full"
                  />

                  {/* ปุ่มสำหรับลบสินค้า */}
                  <Trash2
                    className="cursor-pointer"
                    onClick={() => removeFromCart(item.id)}
                  />
                </div>

                <div className="flex text-sm items-center justify-end">
                  <p>ราคา: ฿{item.price}</p>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* คำนวณราคารวม */}
        <p className="text-right text-sm">
          ราคาทั้งหมด: ฿
          {cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}
        </p>
        <Separator />

        <Button className="mt-auto py-2 px-4 rounded">ยืนยันออเดอร์</Button>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
