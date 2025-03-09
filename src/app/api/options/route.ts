//options
import { NextResponse } from "next/server";
import connection from "@/lib/db"; // ใช้เชื่อมต่อกับ MySQL
import { RowDataPacket, OkPacket } from "mysql2";

// ดึงตัวเลือกเสริมทั้งหมดที่มีในร้านนั้นๆ ตาม shop_id
export async function GET(req: Request) {
  const url = new URL(req.url);
  const shopId = url.searchParams.get("shop_id");

  if (!shopId) {
    return NextResponse.json({ error: "กรุณาระบุ shop_id" }, { status: 400 });
  }

  try {
    // ดึงข้อมูลกลุ่มตัวเลือกเสริมจากฐานข้อมูล
    const [options] = await connection.execute<RowDataPacket[]>(`
      SELECT * FROM option_groups WHERE shop_id = ?;
    `, [shopId]);

    // ดึงข้อมูลตัวเลือกเสริม (items) ที่เชื่อมโยงกับ option
    const optionsWithItems = await Promise.all(
      options.map(async (option) => {
        const [items] = await connection.execute<RowDataPacket[]>(`
          SELECT * FROM option_items WHERE group_id = ?;
        `, [option.group_id]);

        return { ...option, items };
      })
    );

    return NextResponse.json({ options: optionsWithItems });
  } catch (error) {
    console.error("Error fetching options:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงตัวเลือกเสริม" }, { status: 500 });
  }
}

// เพิ่มตัวเลือกเสริมใหม่
export async function POST(req: Request) {
  const { shop_id, group_name, item_name, add_price } = await req.json();

  if (!shop_id || !group_name || !item_name || !add_price) {
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
  }

  try {
    // เพิ่มกลุ่มตัวเลือกเสริมใหม่
    const [newOptionResult] = await connection.execute<OkPacket>(
      `
      INSERT INTO option_groups (shop_id, group_name) 
      VALUES (?, ?);
    `,
      [shop_id, group_name]
    );

    const newOptionId = newOptionResult.insertId; // เข้าถึง insertId จาก OkPacket

    if (!newOptionId) {
      throw new Error("ไม่สามารถเพิ่มกลุ่มตัวเลือกเสริมได้");
    }

    // เพิ่มตัวเลือกเสริม (items) ในกลุ่มนั้น
    const [newItemResult] = await connection.execute<RowDataPacket[]>(
      `
      INSERT INTO option_items (group_id, item_name, add_price) 
      VALUES (?, ?, ?);
    `,
      [newOptionId, item_name, add_price]
    );

    if (!newItemResult) {
      throw new Error("ไม่สามารถเพิ่มตัวเลือกเสริม (items) ได้");
    }

    return NextResponse.json({ success: "เพิ่มตัวเลือกเสริมสำเร็จ", newOptionId });
  } catch (error: any) { // ใช้ 'any' เพื่อระบุประเภทของ error
    console.error("Error adding option:", error);
    return NextResponse.json({ error: error.message || "เกิดข้อผิดพลาดในการเพิ่มตัวเลือกเสริม" }, { status: 500 });
  }
}

// อัปเดตราคาในตัวเลือกเสริม
export async function PUT(req: Request) {
    const { item_id, group_id, add_price } = await req.json();
  
    if (!item_id || !group_id || !add_price) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }
  
    try {
      // อัปเดตราคาในตัวเลือกเสริม
      const [updateResult] = await connection.execute<OkPacket>(`
        UPDATE option_items 
        SET add_price = ? 
        WHERE item_id = ? AND group_id = ?;
      `, [add_price, item_id, group_id]);
  
      // ตรวจสอบว่า affectedRows > 0 หรือไม่
      if (updateResult.affectedRows === 0) {
        throw new Error("ไม่พบตัวเลือกเสริมที่ต้องการอัปเดต");
      }
  
      return NextResponse.json({ success: "อัปเดตราคาเรียบร้อย" });
    } catch (error: any) {
      console.error("Error updating item price:", error);
      return NextResponse.json({ error: error.message || "เกิดข้อผิดพลาดในการอัปเดตราคา" }, { status: 500 });
    }
  }
  