import { NextResponse } from "next/server";
import connection from "@/lib/db";
import { JwtPayload } from "jsonwebtoken";
import { FieldPacket, ResultSetHeader } from "mysql2";
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

  // ✅ ดึง `order_id` จาก Query Parameter
  const { searchParams } = new URL(req.url);
  const order_id = searchParams.get("order_id");

  try {
    if (!connection) throw new Error("Database connection is not established.");

    let query = `
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
      WHERE o.shop_id = ? AND o.status = 'รอดำเนินการ'
    `;

    const queryParams: any[] = [user.shop_id];

    // ✅ ถ้ามี `order_id` ให้เพิ่มเงื่อนไขกรอง
    if (order_id) {
      query += " AND o.order_id = ?";
      queryParams.push(order_id);
    }

    query += " GROUP BY o.order_id ORDER BY o.created_at DESC";

    const [orders]: [any[], FieldPacket[]] = await connection.query(query, queryParams);

    // ✅ แปลง `items` จาก String เป็น Array
    const formattedOrders = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items || "[]")
    }));

    // ✅ ถ้าขอ `order_id` เดียว ให้คืนค่าเป็น Object ไม่ใช่ Array
    return NextResponse.json(order_id ? formattedOrders[0] : formattedOrders, { status: 200 });

  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Error fetching orders" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  const user = authenticateToken(req);

  if (!user || (user as JwtPayloadWithRole).role !== "user") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { customer_name, deliveryTime, note, slip, items, shop_id, status } = await req.json();

  if (!customer_name || !items || !Array.isArray(items) || items.length === 0 || !slip || !shop_id) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const areItemsValid = items.every((item) => item.menu_name && item.price > 0 && item.quantity > 0);
  if (!areItemsValid) {
    return NextResponse.json({ error: "Invalid item data" }, { status: 400 });
  }

  const generateOrderNumber = () => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return `TSK-${randomNumber}`;
  };

  const order_number = generateOrderNumber();

  try {
    const totalAmount = items.reduce((total: number, item: { price: number; quantity: number }) =>
      total + item.price * item.quantity, 0);

    // ใช้สถานะที่ได้รับจาก request หรือ 'รอดำเนินการ' เป็นค่าเริ่มต้น
    const orderStatus = status || "รอดำเนินการ";

    const [orderResult]: [ResultSetHeader, FieldPacket[]] = await connection.query(
      "INSERT INTO `orders` (order_number, customer_name, shop_id, status, created_at, deliveryTime, totalAmount, note, slip) VALUES (?, ?, ?, ?, current_timestamp(), ?, ?, ?, ?)",
      [order_number, customer_name, shop_id, orderStatus, deliveryTime, totalAmount, note, slip]
    );

    const orderId = orderResult.insertId;

    const orderItemsQueries = items.map((item) =>
      connection.query(
        "INSERT INTO order_items (order_id, menu_name, price, quantity, menu_image) VALUES (?, ?, ?, ?, ?)",
        [orderId, item.menu_name, item.price, item.quantity, item.menu_image]
      )
    );

    await Promise.all(orderItemsQueries);

    return NextResponse.json({ message: "Order saved successfully!", order: { order_id: orderId, order_number, customer_name, shop_id, status: orderStatus, deliveryTime, totalAmount, note, slip } }, { status: 200 });
  } catch (error) {
    console.error("Error saving order:", error);
    return NextResponse.json({ error: "Error saving order" }, { status: 500 });
  }
}
