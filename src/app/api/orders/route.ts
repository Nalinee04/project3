import { NextResponse, NextRequest } from "next/server";
import connection from "@/lib/db";
import { FieldPacket, ResultSetHeader } from "mysql2";
import { getUserFromToken } from "@/lib/auth"; // ✅ ดึงข้อมูลผู้ใช้จาก token

export async function GET(req: NextRequest) {
  console.log("🔍 Header Authorization:", req.headers.get("Authorization"));

  const { searchParams } = new URL(req.url);
  const order_id = searchParams.get("order_id");
  const status = searchParams.get("status") || "รอดำเนินการ";

  try {
    let query = `
  SELECT 
    o.*, 
    o.shop_name,  -- ✅ ดึงชื่อร้านมาแสดง
    o.out_of_stock_action, 
    COALESCE(
      CONCAT('[', GROUP_CONCAT(
        JSON_OBJECT(
          'menu_name', oi.menu_name, 
          'price', oi.price, 
          'quantity', oi.quantity, 
          'menu_image', oi.menu_image,
          'note', oi.note
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

    if (orders.length === 0) {
      return NextResponse.json({ message: "No orders found" }, { status: 404 });
    }

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
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `TSK-${randomDigits}`;
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { customer_name, shop_id, shop_name, deliveryTime, slip, items, out_of_stock_action, paymentMethod, deliveryType } = body;


    if (!customer_name || !shop_id || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const user = getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 403 });
    }

    let customer_phone = body.customer_phone || user.phone || "N/A";
    const order_number = generateOrderNumber();
    const totalAmount = items.reduce((total: number, item: { price: number; quantity: number }) =>
      total + item.price * item.quantity, 0);

    const [orderResult]: [ResultSetHeader, FieldPacket[]] = await connection.query(
      `INSERT INTO orders 
      (order_number, customer_name, customer_phone, shop_id, shop_name, status, created_at, deliveryTime, totalAmount, slip, out_of_stock_action, paymentMethod, deliveryType) 
      VALUES (?, ?, ?, ?, ?, ?, current_timestamp(), ?, ?, ?, ?, ?, ?);`,
      [order_number, customer_name, customer_phone, shop_id, shop_name, "รอดำเนินการ", deliveryTime || null, totalAmount, slip, out_of_stock_action, paymentMethod, deliveryType]
    );
    

    const orderId = orderResult.insertId;

    const orderItemsQueries = items.map((item) =>
      connection.query(
        "INSERT INTO order_items (order_id, menu_name, price, quantity, menu_image, note) VALUES (?, ?, ?, ?, ?, ?)",
        [orderId, item.menu_name, item.price, item.quantity, item.menu_image, item.note || ""]
      )
    );

    await Promise.all(orderItemsQueries);

    return NextResponse.json({
      message: "Order saved successfully!",
      order: { order_id: orderId, order_number, customer_name, customer_phone, shop_id, status: "รอดำเนินการ", deliveryTime, totalAmount, slip, out_of_stock_action, paymentMethod, deliveryType }
    }, { status: 200 });
  } catch (error) {
    console.error("❌ Error saving order:", error);
    return NextResponse.json({ error: "Error saving order" }, { status: 500 });
  }
}
