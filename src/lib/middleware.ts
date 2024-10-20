import jwt from 'jsonwebtoken'; // นำเข้า jsonwebtoken
import { NextResponse } from 'next/server';

// สร้างฟังก์ชันสำหรับตรวจสอบ Token
export const authenticateToken = (req: Request) => {
  // รับ Token จาก Authorization Header
  const token = req.headers.get('authorization')?.split(' ')[1];

  console.log('Token:', token); // Log token เพื่อการตรวจสอบ

  // ถ้าไม่มี Token ให้คืนค่าข้อความ "Unauthorized"
  if (!token) {
    console.error('No token provided'); // Log ข้อความถ้าไม่มี token
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // ตรวจสอบความถูกต้องของ Token
    const user = jwt.verify(token, process.env.JWT_SECRET as string); // ใช้ JWT_SECRET ที่ตั้งไว้ใน .env

    // ตรวจสอบ user object ที่ได้รับคืนมา
    if (!user || typeof user !== 'object') {
      throw new Error('Invalid token payload');
    }

    return user; // คืนค่าผู้ใช้ (สามารถใช้ข้อมูลของผู้ใช้ต่อได้)
  } catch (error) {
    // ถ้า Token ไม่ถูกต้อง ให้คืนค่าข้อความ "Token is not valid"
    console.error('Token verification error:', error); // Log ข้อผิดพลาด
    const errorMessage = error instanceof jwt.JsonWebTokenError ? 'Token is not valid' : 'Unauthorized';
    return NextResponse.json({ error: errorMessage }, { status: 403 });
  }
};
