import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const SECRET_KEY = process.env.NEXTAUTH_SECRET || "default_secret";

export async function getUserFromToken(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

    const token = authHeader.split(" ")[1];

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
