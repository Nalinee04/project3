import { NextResponse } from "next/server";
import connection from "@/lib/db";
import { FieldPacket } from "mysql2";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const orderId = url.searchParams.get("order_id");

  if (!orderId) {
    return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
  }

  console.log("🔍 Fetching order_items for order_id:", orderId);

  try {
    if (!connection) throw new Error("Database connection is not established.");

    // 📌 ดึงข้อมูลสถานะของคำสั่งซื้อ
    const [orders]: [any[], FieldPacket[]] = await connection.query(
      "SELECT status FROM orders WHERE order_id = ?",
      [orderId]
    );

    if (orders.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 📌 ดึงข้อมูล order_items พร้อม note
    const [orderItems]: [any[], FieldPacket[]] = await connection.query(
      "SELECT item_id, menu_name, price, quantity, menu_image, note FROM order_items WHERE order_id = ?",
      [orderId]
    );

    console.log("✅ Items fetched:", orderItems);

    // 📌 ตรวจสอบให้แน่ใจว่า `orderItems` เป็นอาร์เรย์
    const formattedItems = Array.isArray(orderItems) ? orderItems : [];

    // 📌 แปลงสถานะจาก "รอการยืนยัน" → "รอดำเนินการ" ถ้าจำเป็น
    let orderStatus = orders[0].status;
    if (orderStatus === "รอการยืนยัน") {
      orderStatus = "รอดำเนินการ";
    }

    return NextResponse.json(
      { order_status: orderStatus, items: formattedItems },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching order items:", error);
    return NextResponse.json(
      { error: "Error fetching order items" },
      { status: 500 }
    );
  }
}
