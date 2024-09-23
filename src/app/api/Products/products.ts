// src/api/products.ts
import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';
import multer from 'multer';
import { promisify } from 'util';
import nextConnect from 'next-connect';

// ตั้งค่า multer สำหรับการอัปโหลดไฟล์
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads/', // โฟลเดอร์ที่ใช้เก็บรูปภาพที่อัปโหลด
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  }),
  limits: { fileSize: 5000000 }, // จำกัดขนาดไฟล์ไม่เกิน 5MB
});

// ฟังก์ชันเพื่อเรียกใช้ middleware
const runMiddleware = promisify(upload.single('image'));

const handler = nextConnect();

handler.post(async (req: NextApiRequest & { file?: Express.Multer.File }, res: NextApiResponse) => {
  try {
    // เรียกใช้ multer middleware
    await runMiddleware(req, res);

    const { productName, description, price } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // ตรวจสอบว่ามีการกรอกข้อมูลที่จำเป็นหรือไม่
    if (!productName || !price) {
      return res.status(400).json({ error: 'กรุณากรอกชื่อสินค้าและราคา' });
    }

    console.log('ข้อมูลสินค้า:', { productName, description, price, imageUrl });

    // เพิ่มข้อมูลลงในตาราง products
    await db.query(
      'INSERT INTO products (title, description, price, image_url) VALUES (?, ?, ?, ?)',
      [productName, description, price, imageUrl]
    );
    res.status(200).json({ message: 'เพิ่มสินค้าสำเร็จ' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มสินค้า' });
  }
});

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า' });
  }
});

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing (Multer will handle it)
  },
};

export default handler;
