"use client";

import { useRouter } from "next/navigation";
import { CircleUser, Menu, Package2 } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Cart from "./Cart";

const Header = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-yellow-500 px-4 md:px-6">

      {/* เมนู 3 ขีด ชิดซ้ายสุด */}
      <div className="flex items-center">
        <Sheet>
          <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden bg-transparent">

              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-light">
              <Link href="#" className="text-lg font-semibold">
                <Package2 className="h-6 w-6" />
              </Link>
              <Link href="/home" className="text-muted-foreground transition-colors hover:text-foreground text-base font-normal">
                หน้าหลัก
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                บัญชี
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                คำสั่งซื้อของฉัน
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground" onClick={handleLogout}>
                ออกจากระบบ
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* ส่วนไอคอนต่าง ๆ จัดให้อยู่ด้านขวา */}
      <div className="flex items-center gap-4 ml-auto">
        <Cart />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full bg-transparent">

              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/editprofile">แก้ไขโปรไฟล์ของคุณ</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>ออกจากระบบ</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
