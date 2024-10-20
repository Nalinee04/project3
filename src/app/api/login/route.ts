import { NextResponse } from "next/server";
import connection from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";

interface User extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string; // เพิ่ม role เพื่อเก็บข้อมูลบทบาทของผู้ใช้
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export async function POST(req: Request) {
  try {
    const { identifier, password }: { identifier: string; password: string } = await req.json();

    // ตรวจสอบการป้อนข้อมูล
    if (!identifier || !password) {
      return NextResponse.json(
        { error: "กรุณากรอกชื่อผู้ใช้หรืออีเมลและรหัสผ่าน" },
        { status: 400 }
      );
    }

    const query = "SELECT * FROM users WHERE email = ? OR username = ?";
    const values = [identifier, identifier];

    const [results]: [User[], any] = await connection.query(query, values);

    // ตรวจสอบว่ามีผู้ใช้หรือไม่
    if (results.length === 0) {
      return NextResponse.json({ error: "ไม่พบผู้ใช้" }, { status: 404 });
    }

    const user = results[0];
    // ตรวจสอบรหัสผ่าน
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "รหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // สร้าง Token โดยรวมบทบาทเข้าไปด้วย
    const token = jwt.sign(
      {
        id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role, // เพิ่มบทบาทใน Token
      },
      JWT_SECRET as string,
      { expiresIn: "10h" }
    );

    return NextResponse.json(
      {
        message: "เข้าสู่ระบบสำเร็จ",
        user: {
          id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role, // ส่งบทบาทกลับไปด้วย
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
