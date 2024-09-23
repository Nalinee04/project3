// src/lib/db.ts
import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root', // ชื่อผู้ใช้ฐานข้อมูลของคุณ
  password: '', // รหัสผ่านผู้ใช้ฐานข้อมูลของคุณ (ค่าเริ่มต้นของ XAMPP มักจะว่างเปล่า)
  database: 'db_res', // เปลี่ยนชื่อฐานข้อมูลเป็น db_res ตามที่คุณสร้างไว้
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ฟังก์ชันทดสอบการเชื่อมต่อ
async function testConnection() {
  try {
    const [rows] = await connection.query('SELECT 1 + 1 AS solution');
    console.log('Test query result:', rows[0].solution); // ควรแสดง "2"
  } catch (error) {
    console.error('Error executing test query:', error);
  }
}

// เรียกฟังก์ชันทดสอบการเชื่อมต่อ
testConnection();

export default connection;
