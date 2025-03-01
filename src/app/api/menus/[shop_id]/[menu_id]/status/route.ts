import { NextResponse } from "next/server";
import connection from "@/lib/db";

// อัปเดตสถานะเมนู (เปิด/ปิด)
export async function PUT(req: Request, { params }: { params: { shop_id: string, menu_id: string } }) {
  try {
    const { shop_id, menu_id } = params;
    const { status } = await req.json();

    if (typeof status !== "number") {
      return NextResponse.json({ error: "กรุณาระบุสถานะที่ถูกต้อง" }, { status: 400 });
    }

    const query = "UPDATE menus SET status = ? WHERE shop_id = ? AND menu_id = ?";
    const values = [status, shop_id, menu_id];

    const [result]: any = await connection.query(query, values);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "ไม่พบเมนูที่ต้องการอัปเดต" }, { status: 404 });
    }

    return NextResponse.json({ message: "อัปเดตสถานะเมนูเรียบร้อยแล้ว" });
  } catch (error: any) {
    console.error("Error updating menu status:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
