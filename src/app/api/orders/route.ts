import { NextResponse, NextRequest } from "next/server";
import connection from "@/lib/db";
import { FieldPacket, ResultSetHeader } from "mysql2";

export async function GET(req: NextRequest) {
  console.log("🔍 Header Authorization:", req.headers.get("Authorization"));

  const { searchParams } = new URL(req.url);
  const order_id = searchParams.get("order_id");
  const status = searchParams.get("status") || "รอดำเนินการ";

  try {
    let query = `
      SELECT 
        o.*, 
        COALESCE(
          CONCAT('[', GROUP_CONCAT(
            JSON_OBJECT(
              'menu_name', oi.menu_name, 
              'price', oi.price, 
              'quantity', oi.quantity, 
              'menu_image', oi.menu_image,
              'note', oi.note  -- ✅ เพิ่ม note ตรงนี้
            )
          ), ']'), '[]'
        ) AS items 
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      WHERE o.status = ?
    `;

    const queryParams: any[] = [status];

    if (order_id) {
      query += " AND o.order_id = ?";
      queryParams.push(order_id);
    }

    query += " GROUP BY o.order_id ORDER BY o.created_at DESC";

    const [orders]: [any[], FieldPacket[]] = await connection.query(query, queryParams);

    // ✅ ตรวจสอบว่า `items` เป็น array จริงๆ
    const formattedOrders = orders.map(order => ({
      ...order,
      items: Array.isArray(order.items) ? order.items : JSON.parse(order.items || "[]")
    }));

    return NextResponse.json(order_id ? formattedOrders[0] : formattedOrders, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return NextResponse.json({ error: "Error fetching orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  function generateOrderNumber() {
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // สุ่มเลข 4 หลัก
    return `TSK-${randomDigits}`;
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { customer_name, shop_id, deliveryTime, note, slip, items } = body;

    if (!customer_name || !shop_id || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const order_number = generateOrderNumber(); // ใช้ฟังก์ชันสร้างเลขออเดอร์
    const totalAmount = items.reduce((total: number, item: { price: number; quantity: number }) =>
      total + item.price * item.quantity, 0);

    const [orderResult]: [ResultSetHeader, FieldPacket[]] = await connection.query(
      "INSERT INTO `orders` (order_number, customer_name, shop_id, status, created_at, deliveryTime, totalAmount, note, slip) VALUES (?, ?, ?, ?, current_timestamp(), ?, ?, ?, ?)",
      [order_number, customer_name, shop_id, "รอดำเนินการ", deliveryTime, totalAmount, note, slip]
    );

    const orderId = orderResult.insertId;

    const orderItemsQueries = items.map((item) =>
      connection.query(
        "INSERT INTO order_items (order_id, menu_name, price, quantity, menu_image, note) VALUES (?, ?, ?, ?, ?, ?)", // ✅ เพิ่ม note
        [orderId, item.menu_name, item.price, item.quantity, item.menu_image, item.note || ""]
      )
    );

    await Promise.all(orderItemsQueries);

    return NextResponse.json({
      message: "Order saved successfully!",
      order: { order_id: orderId, order_number, customer_name, shop_id, status: "รอดำเนินการ", deliveryTime, totalAmount, note, slip }
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error saving order:", error);
    return NextResponse.json({ error: "Error saving order" }, { status: 500 });
  }
}
