import { NextResponse } from "next/server";
import connection from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone"); // ✅ ดึงค่าจาก URL

    if (!phone) {
      return NextResponse.json(
        { error: "กรุณาระบุเบอร์โทรศัพท์" },
        { status: 400 }
      );
    }

    if (!connection) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    // 🔍 ตรวจสอบว่าเบอร์โทรนี้มีในฐานข้อมูลหรือไม่
    const query = "SELECT user_id FROM users WHERE phone = ?";
    const [results]: [RowDataPacket[], any] = await connection.query(query, [phone]);

    // ถ้าพบผู้ใช้ -> exists = true
    const exists = results.length > 0;

    return NextResponse.json({ exists });
  } catch (error: any) {
    console.error("Error in /api/checkUser:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด: " + error.message },
      { status: 500 }
    );
  }
}
