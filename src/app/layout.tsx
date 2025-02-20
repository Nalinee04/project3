"use client"; // ทำให้เป็น Client Component

import { Prompt } from "next/font/google"; // ใช้ฟอนต์ Prompt
import "./globals.css";
import Header from "./components/Header";
import { ThemeProvider } from "./components/ThemeProvider";
import { CartProvider } from "./components/CartContext"; // ตรวจสอบให้แน่ใจว่า CartProvider ครอบคลุมทั้งหมด
import { UserProvider } from "./components/Usercontext"; // นำเข้า UserProvider
import { usePathname } from "next/navigation"; // นำเข้า usePathname


const prompt = Prompt({ subsets: ["latin"], weight: ["400", "500", "600", "700"] }); // กำหนดน้ำหนักฟอนต์ที่ต้องการ

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); // ดึง pathname

  // ตรวจสอบหน้าปัจจุบัน
  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const isAdminPage = pathname.startsWith("/admin"); // ตรวจสอบว่าเป็นหน้าที่เริ่มต้นด้วย /admin หรือไม่
  const isDashboardPage = pathname === "/dashboard"; // ตรวจสอบว่าเป็นหน้า dashboard หรือไม่
  const isForgotPage = pathname === "/forgotpassword";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={prompt.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider> {/* ห่อหุ้มด้วย UserProvider */}
            <CartProvider>
              <div className="flex min-h-screen w-full flex-col">
                {/* แสดง Header เฉพาะเมื่อไม่ใช่หน้า login, register, admin หรือ dashboard */}
                {!isLoginPage && !isRegisterPage && !isAdminPage && !isDashboardPage && !isForgotPage && <Header />}
                <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-0 md:gap-8 bg-gray-100">
                  {children} {/* เนื้อหาจะถูกแสดงที่นี่ */}
                </main>
              </div>
            </CartProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
