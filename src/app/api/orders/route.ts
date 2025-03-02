import { NextResponse } from "next/server";
import connection from "@/lib/db";
import { JwtPayload } from "jsonwebtoken"; // ตรวจสอบว่าใช้ชนิดข้อมูล JwtPayload
import { FieldPacket, ResultSetHeader } from "mysql2";
import { authenticateToken } from "@/lib/middleware";

interface JwtPayloadWithRole extends JwtPayload {
  role: string; // เพิ่ม 'role' เป็น string
}

// ******************
// ส่วนที่ใช้ทั้งร้านและลูกค้า
// ******************
export async function GET(req: Request) {
  console.log("🔍 Header Authorization:", req.headers.get("Authorization"));

  const user: any = authenticateToken(req);

  // ถ้าไม่พบ user หรือไม่พบ role ของ user จะบล็อกการเข้าถึง
  if (!user || !user.role) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const order_id = searchParams.get("order_id");

  try {
    if (!connection) throw new Error("Database connection is not established.");

    let query = `
      SELECT 
        o.order_id,
        o.order_number,
        o.customer_name,
        o.shop_id,
        o.status,
        o.created_at,
        o.deliveryTime,
        o.totalAmount, 
        o.note,
        o.slip,
        u.phone AS customer_phone,  -- ดึงเบอร์โทรศัพท์จากตาราง users
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
      LEFT JOIN users u ON o.customer_id = u.id  -- เชื่อมโยงกับตาราง users เพื่อดึงเบอร์โทรศัพท์
    `;

    const queryParams: any[] = [];

    // ตรวจสอบว่าเป็นร้านหรือเป็นลูกค้า
    if (user.role === "shop") {
      // ถ้าเป็นร้านให้กรองตาม shop_id
      query += " WHERE o.shop_id = ? AND o.status = 'รอดำเนินการ'";
      queryParams.push(user.shop_id);
    } else if (user.role === "user") {
      // ถ้าเป็นลูกค้าให้กรองตาม customer_id (สมมติว่า customer_id อยู่ในฐานข้อมูลคำสั่งซื้อ)
      query += " WHERE o.customer_id = ? AND o.status = 'รอดำเนินการ'";
      queryParams.push(user.id); // user.id เป็นรหัสลูกค้า
    }

    // ถ้ามี order_id ให้กรองข้อมูลตาม order_id
    if (order_id) {
      query += " AND o.order_id = ?";
      queryParams.push(order_id);
    }

    query += " GROUP BY o.order_id ORDER BY o.created_at DESC";

    const [orders]: [any[], FieldPacket[]] = await connection.query(query, queryParams);

    const formattedOrders = orders.map((order) => ({
      ...order,
      totalAmount: order.totalAmount,
      items: JSON.parse(order.items || "[]"),
    }));

    return NextResponse.json(order_id ? formattedOrders[0] : formattedOrders, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Error fetching orders" }, { status: 500 });
  }
}

// ******************
// ส่วนที่ใช้ลูกค้า (user) เท่านั้น
// ******************
export async function POST(req: Request) {
  const user = authenticateToken(req);
  
  // ตรวจสอบว่า user เป็น JwtPayload ที่มี property 'role'
  if (!user || (user as JwtPayloadWithRole).role !== "user") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { customer_name, deliveryTime, note, slip, items, shop_id } = await req.json();

  if (!customer_name || !items || !Array.isArray(items) || items.length === 0 || !slip || !shop_id) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const areItemsValid = items.every((item) => item.menu_name && item.price > 0 && item.quantity > 0);
  if (!areItemsValid) {
    return NextResponse.json({ error: "Invalid item data" }, { status: 400 });
  }

  // สร้าง order_number โดยใช้รูปแบบ TSK-XXXXXX
  const generateOrderNumber = () => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000); // สุ่มตัวเลข 6 หลัก
    return `TSK-${randomNumber}`;
  };
  
  const order_number = generateOrderNumber(); // สร้างหมายเลขคำสั่งซื้อ

  try {
    const totalAmount = items.reduce((total: number, item: { price: number; quantity: number }) =>
      total + item.price * item.quantity, 0);

    const [orderResult]: [ResultSetHeader, FieldPacket[]] = await connection.query(
      "INSERT INTO `orders` (order_number, customer_name, shop_id, status, created_at, deliveryTime, totalAmount, note, slip) VALUES (?, ?, ?, ?, current_timestamp(), ?, ?, ?, ?)",
      [order_number, customer_name, shop_id, "รอดดำเนินการ", deliveryTime, totalAmount, note, slip]
    );

    const orderId = orderResult.insertId;

    const orderItemsQueries = items.map((item) =>
      connection.query(
        "INSERT INTO order_items (order_id, menu_name, price, quantity, menu_image) VALUES (?, ?, ?, ?, ?)",
        [orderId, item.menu_name, item.price, item.quantity, item.menu_image]
      )
    );

    await Promise.all(orderItemsQueries);

    return NextResponse.json({ message: "Order saved successfully!", order: { order_id: orderId, order_number, customer_name, shop_id, status: "รอดดำเนินการ", deliveryTime, totalAmount, note, slip } }, { status: 200 });
  } catch (error) {
    console.error("Error saving order:", error);
    return NextResponse.json({ error: "Error saving order" }, { status: 500 });
  }
}
