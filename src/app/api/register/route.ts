// src/app/api/register/route.ts
import { NextResponse } from 'next/server';
import connection from '@/lib/db'; // ตรวจสอบว่าคุณตั้งค่าการเชื่อมต่อกับฐานข้อมูล MySQL ถูกต้อง
import bcrypt from 'bcryptjs';
import { RowDataPacket } from 'mysql2';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    // ตรวจสอบว่าชื่อผู้ใช้หรืออีเมลถูกกรอกหรือไม่
    if (!username || !email || !password) {
      return NextResponse.json({ error: 'กรุณากรอกชื่อผู้ใช้, อีเมล และรหัสผ่าน' }, { status: 400 });
    }

    // ตรวจสอบว่าชื่อผู้ใช้หรืออีเมลมีอยู่ในฐานข้อมูลแล้วหรือไม่
    const checkQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
    const checkValues = [username, email];

    // เรียกใช้ query โดยตรง
    const [existingUser]: [RowDataPacket[], any] = await connection.query(checkQuery, checkValues);

    // ถ้ามีผู้ใช้ที่มีชื่อผู้ใช้หรืออีเมลซ้ำกัน
    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'ชื่อผู้ใช้หรืออีเมลถูกใช้งานแล้ว' }, { status: 400 });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // เพิ่มผู้ใช้ใหม่ในฐานข้อมูล
    const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    const insertValues = [username, email, hashedPassword];

    // เรียกใช้ query โดยตรง
    await connection.query(insertQuery, insertValues);

    // ตอบกลับเมื่อสมัครสมาชิกสำเร็จ
    return NextResponse.json({ message: 'สมัครสมาชิกสำเร็จ' }, { status: 201 });
  } catch (error: any) { // เพิ่มประเภท any ให้กับ error
    console.error('Error in /api/register:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด: ' + error.message }, { status: 500 });
  }
}
