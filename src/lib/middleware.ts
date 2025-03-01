import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export const authenticateToken = (req: Request) => {
  const authHeader = req.headers.get('authorization');
  console.log('🔍 Authorization Header:', authHeader); // ✅ Log Header

  const token = authHeader?.split(' ')[1];
  console.log('🔑 Extracted Token:', token); // ✅ Log Token

  if (!token) {
    console.error('❌ No token provided');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = jwt.verify(token, process.env.NEXTAUTH_SECRET as string);
    console.log('✅ Verified User:', user); // ✅ Log ข้อมูลที่ Decode ออกมา

    if (!user || typeof user !== 'object') {
      throw new Error('Invalid token payload');
    }

    return user;
  } catch (error) {
    console.error('❌ Token verification error:', error);
    const errorMessage = error instanceof jwt.JsonWebTokenError ? 'Token is not valid' : 'Unauthorized';
    return NextResponse.json({ error: errorMessage }, { status: 403 });
  }
};
