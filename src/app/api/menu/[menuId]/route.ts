import { NextResponse } from "next/server";
import connection from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

// ✅ ดึงข้อมูลเมนูตาม menuId
export async function GET(req: Request, { params }: { params: { menuId: string } }) {
  const id = Number(params.menuId);

  try {
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT menu_id, menu_name, price, menu_image, cate_id, status FROM menus WHERE menu_id = ?", 
      [id]
    );

    if (rows.length > 0) {
      return NextResponse.json(rows[0]);
    }

    return NextResponse.json({ error: "ไม่พบเมนู" }, { status: 404 });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  }
}

// ✅ อัปเดตข้อมูลเมนู
export async function PUT(req: Request, { params }: { params: { menuId: string } }) {
  const id = Number(params.menuId);
  const { menu_name, price, menu_image, cate_id, status } = await req.json(); // ✅ รับ status ด้วย

  if (!menu_name || !price || !menu_image || !cate_id || status === undefined) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
  }

  try {
    const [result]: any = await connection.query(
      "UPDATE menus SET menu_name = ?, price = ?, menu_image = ?, cate_id = ?, status = ? WHERE menu_id = ?",
      [menu_name, price, menu_image, cate_id, status, id] // ✅ เพิ่ม status เข้าไปใน SQL
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "ไม่พบเมนูที่ต้องการอัปเดต" }, { status: 404 });
    }

    return NextResponse.json({ message: "เมนูถูกอัปเดตแล้ว" });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  }
}

// ✅ ลบข้อมูลเมนู
export async function DELETE(req: Request, { params }: { params: { menuId: string } }) {
    const id = Number(params.menuId);
  
    try {
      const [result]: any = await connection.query(
        "DELETE FROM menus WHERE menu_id = ?",
        [id]
      );
  
      if (result.affectedRows === 0) {
        return NextResponse.json({ error: "ไม่พบเมนูที่ต้องการลบ" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "เมนูถูกลบแล้ว" });
  
    } catch (error) {
      console.error("Database Error:", error);
      return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
    }
  }
  