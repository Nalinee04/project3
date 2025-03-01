import mysql, { RowDataPacket } from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_res',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 2
});

// ฟังก์ชันทดสอบการเชื่อมต่อ (แบบปล่อย Connection)
async function testConnection() {
  const connection = await pool.getConnection(); // ดึง Connection จาก Pool
  try {
    const [rows]: [RowDataPacket[], any] = await connection.query('SELECT 1 + 1 AS solution');
    console.log('Test query result:', rows[0].solution);
  } catch (error) {
    console.error('Error executing test query:', error);
  } finally {
    connection.release(); // ปล่อย Connection กลับไปที่ Pool
  }
}

// เรียกฟังก์ชันทดสอบการเชื่อมต่อ
testConnection();

export default pool;
