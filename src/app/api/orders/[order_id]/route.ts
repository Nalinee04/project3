import { NextResponse } from "next/server";
import connection from "@/lib/db"; // การเชื่อมต่อฐานข้อมูล
import { FieldPacket } from "mysql2";
import { authenticateToken } from "@/lib/middleware"; // ตรวจสอบการยืนยันตัวตนของผู้ใช้

// ใช้ในกรณีที่ใช้ HTTP GET
export async function GET(req: Request, { params }: { params: { order_id: string } }) {
  const orderId = params.order_id; // ดึง order_id จาก URL params
  const user = authenticateToken(req); // ตรวจสอบการยืนยันตัวตนของผู้ใช้

  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    if (!connection) {
      throw new Error("Database connection is not established.");
    }

    // ค้นหาออเดอร์จากฐานข้อมูลโดยใช้ order_id
    const [orderDetails]: [any[], FieldPacket[]] = await connection.query(
      `SELECT * FROM orders WHERE order_id = ?`, [orderId]
    );

    if (orderDetails.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // ดึงรายการสินค้าที่เกี่ยวข้องกับ order_id นี้
    const [orderItems]: [any[], FieldPacket[]] = await connection.query(
      `SELECT * FROM order_items WHERE order_id = ?`, [orderId]
    );

    // ถ้ามีรายการสินค้า
    if (orderItems.length > 0) {
      // รวมข้อมูล order กับ orderItems
      return NextResponse.json({
        ...orderDetails[0],
        items: orderItems // เพิ่มรายการสินค้าลงในข้อมูลออเดอร์
      }, { status: 200 });
    } else {
      // ถ้าไม่มีสินค้า
      return NextResponse.json({ ...orderDetails[0], items: [] }, { status: 200 });
    }

  } catch (error: any) {
    console.error("Error fetching order details:", error);
    // แจ้งข้อผิดพลาดที่สามารถเข้าใจได้มากขึ้น
    return NextResponse.json({ error: error.message || "Error fetching order details" }, { status: 500 });
  }
}
