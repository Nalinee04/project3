import { NextResponse } from "next/server";
import connection from "@/lib/db";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcrypt"; // ใช้ bcrypt เพื่อเปรียบเทียบรหัสผ่าน

interface User extends RowDataPacket {
  id: number;
  username: string;
  phone: string;
  image: string;
  password: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export async function POST(req: Request) {
  try {
    const { identifier, password }: { identifier: string; password: string } =
      await req.json();

    // ตรวจสอบการป้อนข้อมูล
    if (!identifier || !password) {
      return NextResponse.json(
        { error: "กรุณากรอกเบอร์โทรศัพท์และรหัสผ่าน" },
        { status: 400 }
      );
    }

    // เช็คเบอร์โทรศัพท์ในฐานข้อมูล
    const query = "SELECT * FROM users WHERE phone = ?";
    const values = [identifier];

    const [results]: [User[], any] = await connection.query(query, values);

    // ตรวจสอบว่ามีผู้ใช้หรือไม่
    if (results.length === 0) {
      return NextResponse.json({ error: "ไม่พบผู้ใช้" }, { status: 404 });
    }

    const user = results[0];

    // ตรวจสอบรหัสผ่าน
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "รหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // สร้าง Token โดยรวมบทบาทเข้าไปด้วย
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        phone: user.phone,
        image: user.image,
        role: user.role,
      },
      JWT_SECRET as string,
      { expiresIn: "10h" }
    );

    // Log การเข้าสู่ระบบสำเร็จ

    return NextResponse.json(
      {
        message: "เข้าสู่ระบบสำเร็จ",
        user: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          image: user.image,
          role: user.role,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in /api/login:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด: " + error.message },
      { status: 500 }
    );
  }
}
