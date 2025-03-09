//history
import { NextResponse } from "next/server";
import connection from "@/lib/db";
import { FieldPacket } from "mysql2";
import { authenticateToken } from "@/lib/middleware";

export async function GET(req: Request) {
  console.log("🔍 Header Authorization:", req.headers.get("Authorization"));

  const user = authenticateToken(req);
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    if (!connection) throw new Error("Database connection is not established.");

    // ✅ ดึงเฉพาะออเดอร์ที่มีสถานะ "เสร็จแล้ว"
    const [completedOrders]: [any[], FieldPacket[]] = await connection.query(`
      SELECT * FROM orders WHERE status = 'เสร็จแล้ว' ORDER BY created_at DESC
    `);

    return NextResponse.json(completedOrders, { status: 200 });
  } catch (error) {
    console.error("Error fetching order history:", error);
    return NextResponse.json(
      { error: "Error fetching order history" },
      { status: 500 }
    );
  }
}
