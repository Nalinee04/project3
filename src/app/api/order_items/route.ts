import { NextResponse } from "next/server";
import connection from "@/lib/db";
import { FieldPacket } from "mysql2";
import { authenticateToken } from "@/lib/middleware";

// 📌 ดึงรายการ order_items พร้อมสถานะคำสั่งซื้อ
export async function GET(req: Request) {
  const url = new URL(req.url);
  const orderId = url.searchParams.get("order_id");

  if (!orderId) {
    return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
  }

  console.log("🔍 Fetching order_items for order_id:", orderId);

  const user = authenticateToken(req);
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    if (!connection) throw new Error("Database connection is not established.");

    // 📌 ดึงข้อมูลคำสั่งซื้อ (status) และรายการ order_items
    const [orders]: [any[], FieldPacket[]] = await connection.query(
      "SELECT status FROM orders WHERE order_id = ?",
      [orderId]
    );

    if (orders.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const [orderItems]: [any[], FieldPacket[]] = await connection.query(
      "SELECT * FROM order_items WHERE order_id = ?",
      [orderId]
    );

    // 📌 แปลงสถานะจาก "รอการยืนยัน" → "รอดำเนินการ" ถ้าจำเป็น
    let orderStatus = orders[0].status;
    if (orderStatus === "รอการยืนยัน") {
      orderStatus = "รอดำเนินการ";
    }

    return NextResponse.json(
      { order_status: orderStatus, items: orderItems },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching order items:", error);
    return NextResponse.json(
      { error: "Error fetching order items" },
      { status: 500 }
    );
  }
}
