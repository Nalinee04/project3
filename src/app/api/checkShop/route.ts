//checkshop
import { NextResponse } from "next/server";
import connection from "@/lib/db"; // เชื่อมต่อฐานข้อมูล

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    console.log("📞 เบอร์โทรที่รับมา:", phone); // ตรวจสอบค่าที่ส่งมา

    if (!phone) {
      return NextResponse.json({ error: "กรุณาระบุเบอร์โทรศัพท์" }, { status: 400 });
    }

    // ตรวจสอบว่า phone อยู่ใน shops หรือไม่
    const [results]: any = await connection.query(
      "SELECT shop_id FROM shops WHERE phone_number = ?",
      [phone]
    );

    console.log("🛒 ผลลัพธ์จากฐานข้อมูล:", results); // ตรวจสอบค่าจาก DB

    return NextResponse.json({ isShop: results.length > 0 });
  } catch (error) {
    console.error("❌ Database Error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล" },
      { status: 500 }
    );
  }
}
