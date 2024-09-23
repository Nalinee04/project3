import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db'; // ตรวจสอบว่าการเชื่อมต่อฐานข้อมูลในไฟล์นี้ถูกตั้งค่าอย่างถูกต้อง

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { productName, description, price, imageUrl } = req.body;

    // ตรวจสอบว่ามีการกรอกข้อมูลที่จำเป็นหรือไม่
    if (!productName || !price) {
      return res.status(400).json({ error: 'กรุณากรอกชื่อสินค้าและราคา' });
    }

    console.log('Data received for product:', { productName, description, price, imageUrl });

    try {
      // ตรวจสอบการเชื่อมต่อฐานข้อมูลและตรวจสอบรูปแบบของคำสั่ง SQL
      const result = await db.query(
        'INSERT INTO products (title, description, price, image_url) VALUES (?, ?, ?, ?)',
        [productName, description, price, imageUrl]
      );

      console.log('Database response:', result);

      res.status(200).json({ message: 'เพิ่มสินค้าสำเร็จ' });
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มสินค้า' });
    }

  } else if (req.method === 'GET') {
    try {
      console.log('Fetching products from database...');
      
      const [rows] = await db.query('SELECT * FROM products');

      console.log('Products fetched:', rows);

      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า' });
    }
  } else {
    res.status(405).json({ error: 'ไม่อนุญาตให้ใช้วิธีนี้' });
  }
}
