import { NextResponse } from "next/server";
import connection from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { authenticateToken } from "@/lib/middleware";

interface Shop extends RowDataPacket {
  shop_id: number;
  shop_name: string;
  status: string;
  cate_id: number;
}

export async function GET(req: Request) {
  console.log("🔍 Header Authorization:", req.headers.get("Authorization"));

  const user: any = authenticateToken(req);
  console.log("🛠 ตรวจสอบ user ที่ decode ได้:", user);

  if (!user) {
    console.log("⛔ ไม่มี Token หรือ Token ไม่ถูกต้อง");
    return NextResponse.json({ error: "Forbidden: Invalid token" }, { status: 403 });
  }

  try {
    if (!connection) throw new Error("Database connection is not established.");

    let query: string;
    let params: any[] = [];

    if (user.shop_id) {
      // ✅ ถ้าเป็นร้านค้า ดึงเฉพาะร้านของตัวเอง
      query = `SELECT * FROM shops WHERE shop_id = ?`;
      params = [user.shop_id];
    } else {
      // ✅ ถ้าเป็นลูกค้า ดึงร้านค้าทั้งหมด
      query = `SELECT * FROM shops WHERE status = 'open'`;
      params = []; // 🛠 สำคัญ! ต้องกำหนด params เป็นอาร์เรย์เปล่า
    }

    const [result]: [Shop[], any] = await connection.query(query, params);

    console.log("📦 ข้อมูลร้านค้าที่ดึงมา:", result);

    return NextResponse.json({ shops: result }, { status: 200 }); // ✅ ส่งข้อมูลเป็น { shops: [...] }
  } catch (error: any) {
    console.error("❌ Error fetching shop status:", error);
    return NextResponse.json({ error: "Error fetching shop status" }, { status: 500 });
  }
}
