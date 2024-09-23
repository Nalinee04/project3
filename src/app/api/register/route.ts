// src/app/api/register/route.ts
import { NextResponse } from 'next/server';
import connection from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    const values = [username, email, hashedPassword];

    // ใช้ Promise เพื่อจัดการกับคำสั่ง SQL
    return new Promise((resolve, reject) => {
      connection.query(query, values, (error, results) => {
        if (error) {
          console.error('Database error:', error); // เพิ่มการดีบัก
          reject(NextResponse.json({ error: 'Error registering user' }, { status: 500 }));
          return;
        }
        resolve(NextResponse.json({ message: 'User registered successfully' }, { status: 201 }));
      });
    });
  } catch (error) {
    console.error('Error in /api/register:', error); // เพิ่มการดีบัก
    return NextResponse.json({ error: 'An error occurred: ' + error.message }, { status: 500 });
  }
}
