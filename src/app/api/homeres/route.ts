// app/api/homeres/route.ts

import { NextResponse } from "next/server";
import connection from "@/lib/db";

// ฟังก์ชันสำหรับดึงข้อมูลยอดขายและออเดอร์
async function getHomeData(shop_id: number) {
  try {
    // ดึงยอดขายวันนี้
    const salesTodayQuery = `
      SELECT SUM(total_amount) AS total_sales_today
      FROM orders
      WHERE shop_id = ? AND DATE(order_date) = CURDATE()
    `;
    const [salesTodayResult]: any = await connection.query(salesTodayQuery, [shop_id]);
    const salesToday = salesTodayResult[0]?.total_sales_today || 0;

    // ดึงยอดขายรายเดือน
    const salesThisMonthQuery = `
      SELECT SUM(total_amount) AS total_sales_month
      FROM orders
      WHERE shop_id = ? AND YEAR(order_date) = YEAR(CURDATE()) AND MONTH(order_date) = MONTH(CURDATE())
    `;
    const [salesMonthResult]: any = await connection.query(salesThisMonthQuery, [shop_id]);
    const salesThisMonth = salesMonthResult[0]?.total_sales_month || 0;

    // ดึงจำนวนออเดอร์ทั้งหมด
    const ordersCountQuery = `
      SELECT COUNT(*) AS total_orders
      FROM orders
      WHERE shop_id = ?
    `;
    const [ordersCountResult]: any = await connection.query(ordersCountQuery, [shop_id]);
    const totalOrders = ordersCountResult[0]?.total_orders || 0;

    return {
      salesToday,
      salesThisMonth,
      totalOrders,
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    throw error;
  }
}

// ฟังก์ชันสำหรับ API route
export async function GET(req: Request) {
  try {
    const { shop_id } = req.headers.get('Authorization') ? JSON.parse(req.headers.get('Authorization')!) : {};

    if (!shop_id) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    // ดึงข้อมูลยอดขายและออเดอร์
    const data = await getHomeData(shop_id);

    // ส่งข้อมูลกลับไปยังฝั่งแอป
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/homeres:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด: " + error.message }, { status: 500 });
  }
}
