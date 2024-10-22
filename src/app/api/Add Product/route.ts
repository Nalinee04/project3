import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db'; // การเชื่อมต่อฐานข้อมูล

// ฟังก์ชันสำหรับเพิ่มสินค้า (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productName, description, price, imageUrl } = body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!productName || !price) {
      return NextResponse.json({ error: 'กรุณากรอกชื่อสินค้าและราคา' }, { status: 400 });
    }

    console.log('Data received for product:', { productName, description, price, imageUrl });

    // เพิ่มข้อมูลสินค้าในฐานข้อมูล
    const result = await db.query(
      'INSERT INTO products (title, description, price, image_url) VALUES (?, ?, ?, ?)',
      [productName, description, price, imageUrl]
    );

    console.log('Database response:', result);
    return NextResponse.json({ message: 'เพิ่มสินค้าสำเร็จ' }, { status: 200 });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการเพิ่มสินค้า' }, { status: 500 });
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลสินค้า (GET)
export async function GET() {
  try {
    console.log('Fetching products from database...');
    const [rows] = await db.query('SELECT * FROM products');

    console.log('Products fetched:', rows);
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า' }, { status: 500 });
  }
}
