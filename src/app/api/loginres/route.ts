import { NextResponse } from "next/server";
import connection from "@/lib/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { RowDataPacket } from "mysql2";

interface Shop extends RowDataPacket {
  shop_id: number;
  shop_name: string;
  phone_number: string;
  password: string;
  shop_image: string;
  cate_id: number;
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export async function POST(req: Request) {
  try {
    const { phone_number, password }: { phone_number: string; password: string } = await req.json();

    if (!phone_number || !password) {
      return NextResponse.json({ error: "กรุณากรอกเบอร์โทรศัพท์และรหัสผ่าน" }, { status: 400 });
    }

    if (!connection) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    // ค้นหาร้านค้าในฐานข้อมูล
    const query = "SELECT * FROM shops WHERE phone_number = ?";
    const [results]: [Shop[], any] = await connection.query(query, [phone_number]);

    if (results.length === 0) {
      return NextResponse.json({ error: "ไม่พบร้านค้าด้วยเบอร์โทรนี้" }, { status: 404 });
    }

    const shop = results[0];

    // ตรวจสอบรหัสผ่าน
    const isPasswordCorrect = await bcrypt.compare(password, shop.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    // สร้าง Token สำหรับร้านค้า
    const token = jwt.sign(
      {
        shop_id: shop.shop_id,
        shop_name: shop.shop_name,
        phone_number: shop.phone_number,
        shop_image: shop.shop_image,
        cate_id: shop.cate_id,
        role: "shop", // 🔹 ใส่ role เพื่อแยกระหว่างร้านค้ากับลูกค้า
      },
      JWT_SECRET as string,
      { expiresIn: "10h" }
    );

    return NextResponse.json(
      {
        message: "เข้าสู่ระบบสำเร็จ",
        shop: {
          shop_id: shop.shop_id,
          shop_name: shop.shop_name,
          phone_number: shop.phone_number,
          shop_image: shop.shop_image,
          cate_id: shop.cate_id,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in /api/loginres:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด: " + error.message }, { status: 500 });
  }
}
