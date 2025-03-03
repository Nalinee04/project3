import { NextResponse } from "next/server";
import connection from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface Menu extends RowDataPacket {
  menu_id: number;
  shop_id: number;
  menu_name: string;
  price: number;
  cate_id: number;
  status: number;
  created_at: string;
  menu_image: string | null;
}

interface Shop extends RowDataPacket {
  shop_id: number;
  shop_name: string;
  shop_image: string | null;
  status: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shop_id, menu_name, price, cate_id, status, menu_image /*, options*/ } = body;

    // ตรวจสอบค่าที่ได้รับจาก Body
    if (!shop_id || !menu_name || price === undefined || !cate_id || status === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1️⃣ แปลงราคาให้เป็น string เพื่อหลีกเลี่ยงปัญหาการลบ 0
    const priceStr = String(price);

    // 2️⃣ เพิ่มเมนูใหม่ลงในฐานข้อมูล
    const insertQuery = `
      INSERT INTO menus (shop_id, menu_name, price, cate_id, status, menu_image) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result]: any = await connection.query(insertQuery, [
      shop_id,
      menu_name,
      priceStr, // ใช้ string เพื่อจัดการกับราคา
      cate_id,
      status,
      menu_image || null,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Failed to add menu" }, { status: 500 });
    }

    const menu_id = result.insertId;

    // คอมเมนต์ส่วนตัวเลือกเสริม (options) ไว้ก่อน
    /*
    // 2️⃣ เพิ่มตัวเลือกเสริม (options) ที่เกี่ยวข้องกับเมนูนี้ ถ้ามี
    if (options && Array.isArray(options) && options.length > 0) {
      const optionInsertQuery = `
        INSERT INTO menu_options (menu_id, group_id) VALUES (?, ?)
      `;

      for (const option of options) {
        // ตรวจสอบว่ามี group_id ที่ถูกต้อง
        if (option.group_id) {
          await connection.query(optionInsertQuery, [menu_id, option.group_id]);

          // 3️⃣ เพิ่มตัวเลือกในตาราง option_items (ถ้ามี)
          if (option.items && Array.isArray(option.items) && option.items.length > 0) {
            const itemInsertQuery = `
              INSERT INTO option_items (group_id, item_id, add_price) 
              VALUES (?, ?, ?)
            `;

            for (const item of option.items) {
              // ตรวจสอบ item_id และ add_price ว่ามีข้อมูลหรือไม่
              if (item.item_id && item.add_price !== undefined) {
                await connection.query(itemInsertQuery, [option.group_id, item.item_id, item.add_price]);
              }
            }
          }
        }
      }
    }
    */

    return NextResponse.json({ message: "Menu added successfully", menu_id: menu_id }, { status: 201 });

  } catch (error: any) {
    console.error("❌ Error in POST /api/menu:", error);
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}


// ✅ GET: ดึงข้อมูลเมนูของร้าน
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shop_id = parseInt(searchParams.get("shop_id") || "", 10); // ✅ แปลงเป็น number

    if (!shop_id) {
      return NextResponse.json({ error: "No shop_id provided" }, { status: 400 });
    }

    // ✅ ดึงข้อมูลร้านค้า
    const shopQuery = "SELECT shop_name, shop_image, status FROM shops WHERE shop_id = ?";
    const [shopResults]: [Shop[], any] = await connection.query(shopQuery, [shop_id]);

    if (shopResults.length === 0) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    const shopData = shopResults[0];

    // ✅ ดึงเมนูร้านค้า
    const menuQuery = "SELECT * FROM menus WHERE shop_id = ?";
    const [menuResults]: [Menu[], any] = await connection.query(menuQuery, [shop_id]);

    return NextResponse.json({
      shop_name: shopData.shop_name,
      shop_image: shopData.shop_image || null, // ✅ ป้องกันปัญหาถ้าไม่มีรูป
      shop_status: shopData.status,
      menu: menuResults,
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Error in GET /api/menu:", error);
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}
