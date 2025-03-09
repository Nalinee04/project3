//regis
import { NextResponse } from 'next/server';
import connection from '@/lib/db'; // ตรวจสอบการเชื่อมต่อฐานข้อมูล
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt'; // ใช้สำหรับการเข้ารหัสรหัสผ่าน
import jwt from 'jsonwebtoken'; // ใช้สำหรับการสร้าง token

export async function POST(req: Request) {
  try {
    const { phone, name, password } = await req.json();
    console.log("📥 รับข้อมูล:", { phone, name, password });

    if (!phone || !name || !password) {
      console.log("❌ ข้อมูลไม่ครบ");
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    const checkPhoneQuery = "SELECT * FROM users WHERE phone = ?";
    const [existingPhoneUser]: [RowDataPacket[], any] = await connection.query(checkPhoneQuery, [phone]);
    console.log("🔍 ตรวจสอบเบอร์โทร:", existingPhoneUser);

    if (existingPhoneUser.length > 0) {
      console.log("❌ เบอร์โทรซ้ำ");
      return NextResponse.json({ error: "มีผู้ใช้ที่ใช้เบอร์โทรศัพท์นี้แล้ว" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔑 รหัสผ่านเข้ารหัส:", hashedPassword);

    const insertQuery = "INSERT INTO users (phone, name, password) VALUES (?, ?, ?)";
    const [result]: any = await connection.query(insertQuery, [phone, name, hashedPassword]);
    console.log("✅ ผลลัพธ์การเพิ่มข้อมูล:", result);

    if (result.affectedRows === 0) {
      console.log("❌ INSERT ล้มเหลว");
      return NextResponse.json({ error: "ไม่สามารถเพิ่มผู้ใช้ได้" }, { status: 500 });
    }

    const token = jwt.sign({ phone, name }, "your_secret_key", { expiresIn: "1h" });
    console.log("🎟️ Token:", token);

    return NextResponse.json({ message: "ผู้ใช้ถูกสร้างแล้ว โปรดเข้าสู่ระบบ", token }, { status: 200 });

  } catch (error: any) {
    console.error("🚨 Error in /api/register:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด: " + error.message }, { status: 500 });
  }
}
