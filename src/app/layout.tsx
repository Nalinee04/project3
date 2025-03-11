
"use client";
import { Prompt } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { ThemeProvider } from "./components/ThemeProvider";
import { CartProvider } from "./components/CartContext";
import { UserProvider } from "./components/Usercontext";
import { SessionProvider } from "next-auth/react"; // ✅ เพิ่ม SessionProvider
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BottomNav from "./components/BottomNav";
import { CategoryProvider } from "./context/CategoryContext"; // ✅ Import Context



const prompt = Prompt({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={prompt.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            draggable
            pauseOnHover
            theme="light"
          />

          <SessionProvider>
            <UserProvider>
              <CartProvider>
                <CategoryProvider> {/* ✅ ครอบ Context */}
                  <LayoutContent>{children}</LayoutContent>
                </CategoryProvider>
              </CartProvider>
            </UserProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

// ✅ แยก LayoutContent ออกมา
function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideHeaderPages = [
    "/login",
    "/register",
    "/dashboard",
    "/forgotpassword",
    "/loginrestua",
  ];
  const isAdminPage = pathname.startsWith("/admin");
  const shouldHideHeader = hideHeaderPages.includes(pathname) || isAdminPage;

  return (
    <div className="flex min-h-screen w-full flex-col relative">
      {!shouldHideHeader && <Header />}
      <main className="flex flex-1 flex-col gap-4 bg-[rgb(var(--background))] text-[rgb(var(--foreground))] p-0 md:gap-8 pb-16 overflow-auto">
        {children}
      </main>
      <div className="fixed bottom-0 w-full z-10">
        <BottomNav />
      </div>
    </div>
  );
}
