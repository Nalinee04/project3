import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET || "mysecret";

export function authenticateToken(req: NextRequest) {
  let token: string | null = null;

  // 🔍 ดึง Token จาก Header
  const authHeader = req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 🔍 ถ้าไม่มี Token ใน Header ลองดึงจาก Cookie
  if (!token) {
    const cookies = req.cookies.get("next-auth.session-token")?.value; // ✅ ใช้วิธีอ่าน cookies แบบใหม่
    if (cookies) token = cookies;
  }

  // ❌ ถ้าไม่มี Token เลย
  if (!token) {
    console.warn("⚠️ No token found");
    return null;
  }

  try {
    // ✅ ตรวจสอบ Token
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    // ✅ ใช้ Type Assertion (`as Error`) เพื่อให้ TypeScript รู้ว่า error เป็น Error Object
    const err = error as Error;

    console.error("❌ Invalid Token:", err.message);
    if (err.name === "TokenExpiredError") {
      console.warn("⚠️ Token expired");
    }
    return null;
  }
}
