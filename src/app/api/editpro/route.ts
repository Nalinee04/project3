import { NextResponse } from 'next/server';
import connection from '@/lib/db'; // Database connection
import bcrypt from 'bcryptjs';
import { RowDataPacket } from 'mysql2';
import jwt, { JwtPayload } from 'jsonwebtoken'; 
import validator from 'validator'; 

export async function PATCH(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({ error: 'Internal server error: JWT secret not configured' }, { status: 500 });
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, jwtSecret) as JwtPayload; 
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (!decoded.id) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }

    const userId = decoded.id; 
    const { name, phone, password, image } = await req.json();

    if (!name && !phone && !password && !image) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลที่ต้องการแก้ไข' }, { status: 400 });
    }

    // ตรวจสอบข้อมูล
    if (name && !/^[ก-๙a-zA-Z\s\-]+$/.test(name)) { // อัปเดต RegEx ให้รองรับสัญลักษณ์ "-"
      return NextResponse.json({ error: 'ชื่อไม่ถูกต้อง' }, { status: 400 });
    }

    if (phone && !validator.isMobilePhone(phone, 'th-TH')) {
      return NextResponse.json({ error: 'เบอร์โทรศัพท์ไม่ถูกต้อง' }, { status: 400 });
    }

    const checkDuplicate = async (field: 'name' | 'phone', value: string) => {
      const checkQuery = `SELECT * FROM users WHERE ${field} = ? AND user_id != ?`;
      const checkValues = [value, userId];
      const [existingUser]: [RowDataPacket[], any] = await connection.promise().query(checkQuery, checkValues);
      return existingUser.length > 0;
    };

    if (name && await checkDuplicate('name', name)) {
      return NextResponse.json({ error: 'ชื่อผู้ใช้ถูกใช้งานแล้ว' }, { status: 400 });
    }

    if (phone && await checkDuplicate('phone', phone)) {
      return NextResponse.json({ error: 'เบอร์โทรศัพท์ถูกใช้งานแล้ว' }, { status: 400 });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }

    if (phone) {
      updates.push('phone = ?');
      values.push(phone);
    }

    if (password) {
      if (password.length < 8) {
        return NextResponse.json({ error: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร' }, { status: 400 });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push('password = ?');
      values.push(hashedPassword);
    }

    if (image) {
      updates.push('image = ?');
      values.push(image);
    }

    values.push(userId);

    // ถ้ามีการอัปเดต
    if (updates.length > 0) {
      const updateQuery = `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`;
      await connection.promise().query(updateQuery, values);
      return NextResponse.json({ message: 'โปรไฟล์ของคุณได้รับการอัปเดตสำเร็จ' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'ไม่มีการเปลี่ยนแปลงข้อมูล' }, { status: 200 });
    }

  } catch (error: any) {
    console.error('Error in /api/editpro:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์: ' + error.message }, { status: 500 });
  }
}
