//sale
import { NextResponse } from "next/server";
import connection from "@/lib/db";
import { FieldPacket } from "mysql2";
import { authenticateToken } from "@/lib/middleware";

export async function GET(req: Request) {
  console.log("🔍 Header Authorization:", req.headers.get("Authorization"));

  const user: any = authenticateToken(req);
  console.log("🛠 ตรวจสอบ user ที่ decode ได้:", user);

  if (!user) {
    console.log("⛔ ไม่มี Token หรือ Token ไม่ถูกต้อง");
    return NextResponse.json({ error: "Forbidden: Invalid token" }, { status: 403 });
  }

  if (!user.shop_id) {
    console.log("⛔ ไม่มี shop_id ใน Token");
    return NextResponse.json({ error: "Forbidden: No shop access" }, { status: 403 });
  }

  try {
    if (!connection) throw new Error("Database connection is not established.");

    const [result]: [any[], FieldPacket[]] = await connection.query(
      `SELECT 
          COUNT(order_id) AS total_orders, 
          IFNULL(SUM(totalAmount), 0) AS total_sales,
          IFNULL((
              SELECT SUM(totalAmount) 
              FROM orders 
              WHERE shop_id = ? 
              AND status = 'เสร็จแล้ว' 
              AND DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')
          ), 0) AS monthly_sales
       FROM orders 
       WHERE shop_id = ? AND status = 'เสร็จแล้ว'`, 
      [user.shop_id, user.shop_id]
    );
    
    

    console.log("📊 Sales Data:", result[0]); // Log ข้อมูลยอดขาย
    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return NextResponse.json({ error: "Error fetching sales data" }, { status: 500 });
  }
}
