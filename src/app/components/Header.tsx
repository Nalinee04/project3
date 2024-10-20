"use client";

import { useRouter } from "next/navigation";
import { CircleUser, Menu, Search, Package2, History, Globe } from "lucide-react"; // เพิ่มไอคอน History และ Globe
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./ModeToggle";
import Cart from "./Cart";

const Header = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <nav className="flex items-center gap-6 text-lg font-medium">
        <Link href="/home" className="text-xl font-semibold">
          FOOD THAI
        </Link>
        <Link href="/home" className="text-muted-foreground transition-colors hover:text-foreground">
          หน้าแรก
        </Link>
      </nav>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
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
              หน้าแรก
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              สินค้า
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              ประเภท
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              คำสั่งซื้อของฉัน
            </Link>
            <button onClick={handleLogout} className="hover:text-foreground">
              ออกจากระบบ
            </button>
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-4">
        <form className="ml-auto flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>

        <Link href="/history">
          <Button variant="outline" size="icon" className="rounded-full">
            <History className="h-5 w-5" />
            <span className="sr-only">History</span>
          </Button>
        </Link>

        <Cart />
        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
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
