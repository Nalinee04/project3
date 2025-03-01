import { NextResponse } from "next/server";
import connection from "@/lib/db";
import { FieldPacket, ResultSetHeader } from "mysql2";
import { authenticateToken } from "@/lib/middleware";

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
    o.order_id,
    o.order_number,
    o.customer_name,
    o.shop_id,
    o.status,
    o.created_at,
    o.deliveryTime,
    o.totalAmount,  -- ✅ ดึง totalAmount มาอย่างชัดเจน
    o.note,
    o.slip,
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
      totalAmount: order.totalAmount, // ✅ ทำให้ totalAmount ชัดเจน
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


// 📌 เพิ่มคำสั่งซื้อใหม่
export async function POST(req: Request) {
  const user = authenticateToken(req);
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { order_number, customer_name, deliveryTime, note, slip, items, shop_id } =
    await req.json();

  if (
    !customer_name ||
    !order_number ||
    !items ||
    !Array.isArray(items) ||
    items.length === 0 ||
    !slip ||
    !shop_id
  ) {
    return NextResponse.json(
      {
        error:
          "Missing required fields: customer_name, order_number, items, slip, and shop_id must be provided.",
      },
      { status: 400 }
    );
  }

  const areItemsValid = items.every((item) => {
    return item.menu_name && item.price > 0 && item.quantity > 0;
  });

  if (!areItemsValid) {
    return NextResponse.json(
      {
        error:
          "Invalid item data. Each item must have a valid menu_name, price greater than zero, and quantity greater than zero.",
      },
      { status: 400 }
    );
  }

  try {
    const totalAmount = items.reduce(
      (total: number, item: { price: number; quantity: number }) =>
        total + item.price * item.quantity,
      0
    );

    // ✅ เพิ่ม order ลงในตาราง `orders`
    const [orderResult]: [ResultSetHeader, FieldPacket[]] =
      await connection.query(
        "INSERT INTO `orders` (order_number, customer_name, shop_id, status, created_at, deliveryTime, totalAmount, note, slip) VALUES (?, ?, ?, ?, current_timestamp(), ?, ?, ?, ?)",
        [
          order_number,
          customer_name,
          shop_id,
          "รอดำเนินการ",
          deliveryTime,
          totalAmount,
          note,
          slip,
        ]
      );

    const orderId = orderResult.insertId;

    // ✅ เพิ่มรายการ order_items
    const orderItemsQueries = items.map((item) =>
      connection.query(
        "INSERT INTO order_items (order_id, menu_name, price, quantity, menu_image) VALUES (?, ?, ?, ?, ?)",
        [orderId, item.menu_name, item.price, item.quantity, item.menu_image]
      )
    );

    await Promise.all(orderItemsQueries);

    const savedOrder = {
      order_id: orderId,
      order_number,
      customer_name,
      shop_id,
      status: "รอดำเนินการ",
      deliveryTime,
      totalAmount,
      note,
      slip,
    };

    return NextResponse.json(
      { message: "Order saved successfully!", order: savedOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving order:", error);
    return NextResponse.json({ error: "Error saving order" }, { status: 500 });
  }
}

// 📌 ยกเลิกออเดอร์
export async function DELETE(req: Request) {
  const user: any = authenticateToken(req);
  if (!user || !user.shop_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { order_id } = await req.json();

  if (!order_id) {
    return NextResponse.json(
      { error: "Missing required field: order_id" },
      { status: 400 }
    );
  }

  try {
    // ✅ ตรวจสอบว่า order_id นี้เป็นของร้านที่ล็อกอินอยู่หรือไม่
    const [existingOrders]: [any[], FieldPacket[]] = await connection.query(
      "SELECT * FROM orders WHERE order_id = ? AND shop_id = ?",
      [order_id, user.shop_id]
    );

    if (existingOrders.length === 0) {
      return NextResponse.json(
        { error: "Order not found or access denied" },
        { status: 404 }
      );
    }

    // ✅ เปลี่ยนสถานะเป็น "ยกเลิก"
    await connection.query("UPDATE orders SET status = 'ยกเลิก' WHERE order_id = ?", [order_id]);

    return NextResponse.json(
      { message: "Order cancelled successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { error: "Error cancelling order" },
      { status: 500 }
    );
  }
}
