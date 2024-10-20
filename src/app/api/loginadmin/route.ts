import { NextResponse } from 'next/server';
import connection from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2/promise';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Check if email and password are provided
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Query to find admin user by email
    const query = 'SELECT * FROM users WHERE email = ? AND role = "admin"';
    const values = [email];

    let results;
    try {
      const [rows] = await connection.query<RowDataPacket[]>(query, values);
      results = rows;
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Database query error' }, { status: 500 });
    }

    // Check if admin user is found
    if (results.length === 0) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    const admin = results[0];
    console.log('Admin data:', admin); // Log admin data

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // Create a JWT token
    const token = jwt.sign(
      {
        id: admin.user_id, // ใช้ user_id
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
      JWT_SECRET as string,
      { expiresIn: "10h" }
    );

    console.log('Generated token:', token);
    
    // If successful, return the response
    return NextResponse.json(
      {
        message: 'Login successful',
        userId: admin.user_id, // ใช้ user_id
        token,
      },
      { status: 200 }
    );

  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in /api/loginadmin:', error.message);
      return NextResponse.json({ error: 'An unexpected error occurred: ' + error.message }, { status: 500 });
    } else {
      console.error('Unknown error in /api/loginadmin:', error);
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}
