import { NextResponse } from "next/server";
import connection from "@/lib/db";
import { JwtPayload } from "jsonwebtoken";
import { FieldPacket } from "mysql2";
import { authenticateToken } from "@/lib/middleware";

interface JwtPayloadWithRole extends JwtPayload {
  role: string;
}

export async function GET(req: Request) {
  console.log("🔍 Header Authorization:", req.headers.get("Authorization"));

  const user: any = authenticateToken(req);
  if (!user || !user.shop_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    if (!connection) throw new Error("Database connection is not established.");

    // ✅ ดึงเฉพาะออเดอร์ที่มีสถานะ "เตรียมอาหาร"
    const [orders]: [any[], FieldPacket[]] = await connection.query(`
      SELECT 
        o.*, 
        COALESCE(
          CONCAT('[', GROUP_CONCAT(
            JSON_OBJECT(
              'menu_name', oi.menu_name, 
              'price', oi.price, 
              'quantity', oi.quantity, 
              'menu_image', oi.menu_image
            )
          ), ']'), '[]'
        ) AS items 
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      WHERE o.shop_id = ? AND o.status = 'เตรียมอาหาร'
      GROUP BY o.order_id
      ORDER BY o.created_at DESC
    `, [user.shop_id]);

    // แปลง `items` จาก String เป็น Array
    const formattedOrders = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items || "[]")
    }));

    return NextResponse.json(formattedOrders, { status: 200 });

  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Error fetching orders" },
      { status: 500 }
    );
  }
}
