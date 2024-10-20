//app/api/resetpassword/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connection from '@/lib/db'; 

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    // ตรวจสอบว่าโทเค็นและรหัสผ่านใหม่ถูกส่งมาหรือไม่
    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    const secret = process.env.JWT_SECRET!;
    
    // ตรวจสอบโทเค็น (จัดการกรณีที่โทเค็นไม่ถูกต้องหรือหมดอายุ)
    let decoded;
    try {
      decoded = jwt.verify(token, secret) as { userId: number };
    } catch (error) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // เข้ารหัสรหัสผ่านใหม่
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // อัปเดตรหัสผ่านในฐานข้อมูล
    const userId = decoded.userId;
    await connection.query('UPDATE users SET password = ? WHERE user_id = ?', [hashedPassword, userId]);

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error in /api/resetpassword:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
