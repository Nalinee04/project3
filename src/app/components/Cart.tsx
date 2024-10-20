import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCart } from './CartContext'; // ดึง useCart จาก CartContext
import { useRouter } from 'next/navigation'; // ใช้ useRouter เพื่อทำการ redirect

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart(); // ใช้ useCart เพื่อดึงฟังก์ชัน
  const router = useRouter(); // ใช้ useRouter เพื่อ redirect

  const handleConfirmOrder = () => {
    // สร้าง query string สำหรับส่งข้อมูลสินค้าไปยังหน้า Confirmation
    const query = cartItems
      .map(
        (item) =>
          `id=${encodeURIComponent(item.id)}&name=${encodeURIComponent(
            item.name
          )}&price=${item.price}&quantity=${item.quantity}&image=${encodeURIComponent(item.image)}`
      )
      .join("&");

    // Redirect ไปยังหน้าคอนเฟิร์มคำสั่งซื้อพร้อมกับส่งข้อมูลสินค้าผ่าน query string
    router.push(`/confirm?${query}`);
  };

  return (
    <Sheet>
      <SheetTrigger>
        {/* แสดงไอคอนตะกร้าพร้อมจำนวนสินค้า */}
        <div className="relative">
          <ShoppingCart className="h-6 w-6" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </div>
      </SheetTrigger>

      <SheetContent className="flex flex-col h-full p-4">
        <SheetHeader>
          <SheetTitle>รายการสินค้าในตะกร้า</SheetTitle>
          <SheetDescription>สินค้าในตะกร้าของคุณ</SheetDescription>
        </SheetHeader>

        <Separator />
        <ScrollArea className="rounded-md border p-4">
          <div className="flex flex-col gap-4 flex-grow">
            {/* แสดงรายการสินค้าในตะกร้า */}
            {cartItems.map((item) => (
              <div key={item.id}>
                <div className="flex items-center justify-between ml">
                  <div className="w-20 h-20 relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="border-solid border-2 rounded-full ml"
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
                    className="w-16 text-center border-solid border-2 rounded-full ml-auto"
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
          {cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          )}
        </p>
        <Separator />

        {/* ปุ่มยืนยันออเดอร์ */}
        <Button className="mt-auto py-2 px-4 rounded" onClick={handleConfirmOrder}>
          ยืนยันออเดอร์
        </Button>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
