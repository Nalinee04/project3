//app/menue/detail/route.ts
import { NextResponse } from "next/server";
import connection from "@/lib/db";
import { RowDataPacket } from "mysql2";

// โครงสร้างของข้อมูลในฐานข้อมูล
interface Menu extends RowDataPacket {
  menu_id: number;
  shop_id: number;
  menu_name: string;
  price: number;
  cate_id: number;
  status: number;
  created_at: string;
  menu_image: string;
}

interface OptionGroup extends RowDataPacket {
  group_id: number;
  group_name: string;
  is_required: number;
  max_select: number;
}

interface OptionItem extends RowDataPacket {
  item_id: number;
  group_id: number;
  item_name: string;
  add_price: number;
}

// GET: ดึงรายละเอียดเมนู + ตัวเลือกที่เกี่ยวข้อง
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const menu_id = searchParams.get("menu_id");

    if (!menu_id) {
      return NextResponse.json({ error: "No menu_id provided" }, { status: 400 });
    }

    // 1️⃣ ดึงข้อมูลเมนูจากฐานข้อมูล
    const menuQuery = "SELECT * FROM menus WHERE menu_id = ?";
    const [menuResults]: [Menu[], any] = await connection.query(menuQuery, [menu_id]);

    if (menuResults.length === 0) {
      return NextResponse.json({ error: "Menu not found" }, { status: 404 });
    }

    const menu = menuResults[0];

    // 2️⃣ ดึงเฉพาะ option groups ที่เกี่ยวข้องกับเมนูนี้
    const groupQuery = `
      SELECT og.group_id, og.group_name, og.is_required, og.max_select
      FROM option_groups og
      JOIN menu_options mo ON og.group_id = mo.group_id
      WHERE mo.menu_id = ?`;

    const [groupResults]: [OptionGroup[], any] = await connection.query(groupQuery, [menu_id]);

    if (groupResults.length === 0) {
      return NextResponse.json({ menu, options: [] }, { status: 200 });
    }

    // 3️⃣ ดึง option items ที่อยู่ในกลุ่มของเมนูนี้
    const groupIds = groupResults.map((g) => g.group_id);

    const itemsQuery = `
      SELECT oi.item_id, oi.group_id, oi.item_name, oi.add_price 
      FROM option_items oi
      WHERE oi.group_id IN (?)`;

    const [itemResults]: [OptionItem[], any] = await connection.query(itemsQuery, [groupIds]);

    // 4️⃣ จัดข้อมูลให้อยู่ในรูปแบบที่ UI ใช้งานง่าย
    const formattedGroups = groupResults.map((group) => ({
      group_id: group.group_id,
      group_name: group.group_name,
      is_required: group.is_required,
      max_select: group.max_select,
      options: itemResults
        .filter((item) => item.group_id === group.group_id)
        .map((item) => ({
          item_id: item.item_id,
          item_name: item.item_name,
          add_price: item.add_price,
        })),
    }));

    // ✅ ส่ง Response กลับไป
    return NextResponse.json({
      menu,
      options: formattedGroups,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error in GET /api/menu/detail:", error);
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}
