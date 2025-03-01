import { NextResponse } from "next/server";
import connection from "@/lib/db";
import { authenticateToken } from "@/lib/middleware";

export async function PATCH(req: Request) {
  const user = authenticateToken(req);
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { order_id, status } = await req.json();

    if (!order_id || !status) {
      return NextResponse.json(
        { error: "Missing order_id or status" },
        { status: 400 }
      );
    }

    if (!connection) throw new Error("Database connection is not established.");

    // ✅ ตรวจสอบสถานะและอัปเดต `deliveryTime` เมื่อสถานะเป็น "เสร็จแล้ว"
    await connection.query(
      "UPDATE orders SET status = ?, deliveryTime = IF(? = 'เสร็จแล้ว', NOW(), deliveryTime) WHERE order_id = ?",
      [status, status, order_id]
    );

    return NextResponse.json(
      { message: "Order status updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Error updating order status" },
      { status: 500 }
    );
  }
}
