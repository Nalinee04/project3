// app/api/menus/[shop_id]/[menu_id]/route.ts
import { NextResponse } from "next/server";
import connection from "@/lib/db";
import { RowDataPacket } from "mysql2";

// อัปเดตข้อมูลเมนู
export async function PUT(req: Request, { params }: { params: { shop_id: string, menu_id: string } }) {
  const { shop_id, menu_id } = params;
  const { menu_name, price, cate_id, status, menu_image } = await req.json();

  if (!menu_name || !price || !cate_id || !status || !menu_image) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
  }

  const query = "UPDATE menus SET menu_name = ?, price = ?, cate_id = ?, status = ?, menu_image = ? WHERE shop_id = ? AND menu_id = ?";
  const values = [menu_name, price, cate_id, status, menu_image, shop_id, menu_id];

  const [result]: [any, any] = await connection.query(query, values);

  if (result.affectedRows === 0) {
    return NextResponse.json({ error: "ไม่พบเมนูที่ต้องการอัปเดต" }, { status: 404 });
  }

  return NextResponse.json({ message: "เมนูถูกอัปเดตแล้ว" });
}

// ลบเมนู
export async function DELETE(req: Request, { params }: { params: { shop_id: string, menu_id: string } }) {
  const { shop_id, menu_id } = params;

  const query = "DELETE FROM menus WHERE shop_id = ? AND menu_id = ?";
  const values = [shop_id, menu_id];

  const [result]: [any, any] = await connection.query(query, values);

  if (result.affectedRows === 0) {
    return NextResponse.json({ error: "ไม่พบเมนูที่ต้องการลบ" }, { status: 404 });
  }

  return NextResponse.json({ message: "เมนูถูกลบแล้ว" });
}
