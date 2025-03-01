import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name: string;
      phone: string;
      image: string;
      role: string;
      shop_id?: number | null; // ✅ เพิ่ม shop_id
    };
    accessToken?: string; // ✅ accessToken ยังอยู่เหมือนเดิม
  }

  interface User {
    id: number;
    name: string;
    phone: string;
    image: string;
    role: string;
    shop_id?: number | null; // ✅ เพิ่ม shop_id
  }

  interface JWT {
    id: number;
    name: string;
    phone: string;
    image: string;
    role: string;
    shop_id?: number | null; // ✅ เพิ่ม shop_id ใน JWT ด้วย
    accessToken?: string;
  }
}
