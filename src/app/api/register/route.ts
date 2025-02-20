import { NextResponse } from 'next/server';
import connection from '@/lib/db'; // ตรวจสอบการเชื่อมต่อฐานข้อมูล
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt'; // ใช้สำหรับการเข้ารหัสรหัสผ่าน
import jwt from 'jsonwebtoken'; // ใช้สำหรับการสร้าง token

export async function POST(req: Request) {
  try {
    const { phone, name, password } = await req.json();

    // ตรวจสอบว่าผู้ใช้กรอกข้อมูลครบถ้วน
    if (!phone || !name || !password) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 });
    }

    // ตรวจสอบว่าเบอร์โทรศัพท์เป็นตัวเลขและไม่เกิน 10 หลัก
    const phonePattern = /^[0-9]{10}$/;
    if (!phone.match(phonePattern)) {
      return NextResponse.json({ error: 'เบอร์โทรศัพท์ต้องเป็นตัวเลขและมีจำนวน 10 หลัก' }, { status: 400 });
    }

    // ตรวจสอบว่า ชื่อ ห้ามมีตัวเลข
    const namePattern = /^[A-Za-z\u0E00-\u0E7F ]+$/;
    if (!name.match(namePattern)) {
      return NextResponse.json({ error: 'ชื่อห้ามมีตัวเลข' }, { status: 400 });
    }

    // ตรวจสอบว่าเบอร์โทรนี้มีอยู่ในฐานข้อมูลหรือไม่
    const checkPhoneQuery = 'SELECT * FROM users WHERE phone = ?';
    const [existingPhoneUser]: [RowDataPacket[], any] = await connection.query(checkPhoneQuery, [phone]);
    if (existingPhoneUser.length > 0) {
      return NextResponse.json({ error: 'มีผู้ใช้ที่ใช้เบอร์โทรศัพท์นี้แล้ว' }, { status: 400 });
    }

    // ตรวจสอบว่า ชื่อนี้มีอยู่ในระบบหรือไม่
    const checkNameQuery = 'SELECT * FROM users WHERE name = ?';
    const [existingNameUser]: [RowDataPacket[], any] = await connection.query(checkNameQuery, [name]);
    if (existingNameUser.length > 0) {
      return NextResponse.json({ error: 'มีผู้ใช้ที่ใช้ชื่อนี้แล้ว' }, { status: 400 });
    }

    // เข้ารหัสรหัสผ่านก่อนบันทึกลงฐานข้อมูล
    const hashedPassword = await bcrypt.hash(password, 10);

    // ถ้าไม่มีผู้ใช้ที่มีเบอร์โทรศัพท์หรือชื่อซ้ำ ก็สามารถสมัครสมาชิกใหม่ได้
    const insertQuery = 'INSERT INTO users (phone, name, password) VALUES (?, ?, ?)';
    await connection.query(insertQuery, [phone, name, hashedPassword]);

    // สร้าง JWT token
    const token = jwt.sign({ phone, name }, 'your_secret_key', { expiresIn: '1h' });

    return NextResponse.json({ message: 'ผู้ใช้ถูกสร้างแล้ว โปรดเข้าสู่ระบบ', token }, { status: 200 });

  } catch (error: any) {
    console.error('Error in /api/register:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด: ' + error.message }, { status: 500 });
  }
}
