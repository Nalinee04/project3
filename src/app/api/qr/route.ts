import { NextResponse } from "next/server";
import connection from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface Shop extends RowDataPacket {
  shop_id: number;
  shop_name: string;
  qr_code: string;
  account_name: string; // ✅ เพิ่มฟิลด์ account_name
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shop_id = searchParams.get("shop_id");

    if (!shop_id) {
      return NextResponse.json({ error: "No shop_id provided" }, { status: 400 });
    }

    // ✅ ดึง account_name ด้วย
    const shopQuery = "SELECT qr_code, account_name FROM shops WHERE shop_id = ?";
    const [shopResults]: [Shop[], any] = await connection.query(shopQuery, [shop_id]);

    if (shopResults.length === 0) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    return NextResponse.json({
      qr_code: shopResults[0].qr_code,
      account_name: shopResults[0].account_name, // ✅ เพิ่ม account_name
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error in GET /api/qr:", error);
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}
