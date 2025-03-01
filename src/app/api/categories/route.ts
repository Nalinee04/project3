//app/api/categories/route.ts
import { NextResponse } from "next/server";
import connection from "@/lib/db";
import { RowDataPacket } from "mysql2";

// ดึงข้อมูลประเภทอาหารทั้งหมด
export async function GET() {
  try {
    const query = "SELECT * FROM categories";
    const [results]: [RowDataPacket[], any] = await connection.query(query);

    if (results.length === 0) {
      return NextResponse.json({ error: "ไม่พบประเภทอาหาร" }, { status: 404 });
    }

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    console.error("Error in /api/categories:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด: " + error.message }, { status: 500 });
  }
}
