import connection from './db'; // นำเข้าการเชื่อมต่อฐานข้อมูล
import { User } from '@/types/User'; // นำเข้า User interface
import { RowDataPacket } from 'mysql2'; // นำเข้า RowDataPacket

// ฟังก์ชันดึงข้อมูลผู้ใช้ตาม userId
export async function getUserById(userId: number): Promise<User | null> {
  try {
    const query = 'SELECT user_id,name, password, phone, image FROM users WHERE user_id = ?'; // ใช้ user_id เพื่อให้ตรงกับฐานข้อมูล
    const [rows]: [RowDataPacket[], any] = await connection.query(query, [userId]); // ใช้ RowDataPacket[]

    if (rows.length === 0) {
      return null; // ถ้าไม่พบผู้ใช้
    }

    return rows[0] as User; // ส่งกลับข้อมูลผู้ใช้ตัวแรก
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้ได้'); // ข้อความผิดพลาด
  }
}
