import { NextResponse } from 'next/server';
import connection from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const query = 'SELECT * FROM users WHERE email = ?';
    const values = [email];

    // ใช้ async/await กับ connection.query โดยตรง
    const [results] = await connection.query(query, values);

    // ตรวจสอบว่าพบผู้ใช้หรือไม่
    if (results.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // ตรวจสอบรหัสผ่าน
    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // ถ้าการตรวจสอบถูกต้อง ให้ส่งการตอบกลับเป็น JSON
    return NextResponse.json({ message: 'Login successful' }, { status: 200 });

  } catch (error) {
    console.error('Error in /api/login:', error);
    return NextResponse.json({ error: 'An error occurred: ' + error.message }, { status: 500 });
  }
}
