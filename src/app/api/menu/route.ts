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

// ✅ POST: เพิ่มเมนูใหม่
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shop_id, menu_name, price, cate_id, status, menu_image } = body;

    if (!shop_id || !menu_name || price === undefined || !cate_id || status === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const insertQuery = `
      INSERT INTO menus (shop_id, menu_name, price, cate_id, status, menu_image) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result]: any = await connection.query(insertQuery, [
      shop_id,
      menu_name,
      price,
      cate_id,
      status,
      menu_image || null, // ✅ ป้องกันปัญหาถ้าไม่มีรูป
    ]);

    return result.affectedRows === 1
      ? NextResponse.json({ message: "Menu added successfully", menu_id: result.insertId }, { status: 201 })
      : NextResponse.json({ error: "Failed to add menu" }, { status: 500 });

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
