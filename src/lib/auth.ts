import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.NEXTAUTH_SECRET || "default_secret";

export function getUserFromToken(token?: string) {
  if (!token) return null; // ✅ ถ้าไม่มี token ให้ return null

  try {
    console.log("🛠️ Raw Token:", token);
    const decoded = jwt.verify(token, SECRET_KEY) as any;

    console.log("🔓 Decoded Token:", decoded);

    return {
      id: decoded.id,
      name: decoded.name,
      phone: decoded.phone,
      image: decoded.image,
      role: decoded.role,
      shop_id: decoded.shop_id ?? null,
    };
  } catch (error) {
    console.error("🚨 Error decoding token:", error);
    return null;
  }
}
