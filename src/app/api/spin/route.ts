import { NextResponse } from "next/server";
import connection from "@/lib/db";  // การเชื่อมต่อฐานข้อมูล
import { RowDataPacket } from "mysql2";

// โครงสร้างของข้อมูลการหมุน
interface SpinHistory extends RowDataPacket {
  id: number;
  user_id: number;
  menu_id: number;
  is_secret: boolean;
  spin_date: string;
}

// โครงสร้างของข้อมูลเมนู
interface Menu extends RowDataPacket {
  menu_id: number;
  menu_name: string;
  price: number;
  menu_image: string;
  is_secret: boolean;  // ใช้บ่งบอกว่าเป็นเมนูลับหรือไม่
}

// GET: ตรวจสอบจำนวนสิทธิ์การหมุนของผู้ใช้
export async function GET(request: Request, { params }: { params: { user_id: string } }) {
  try {
    const userId = params.user_id;

    // 1️⃣ ดึงข้อมูลสิทธิ์การหมุนจากฐานข้อมูล
    const [spinData]: [SpinHistory[], any] = await connection.query(
      'SELECT spin_count, used_spins_today, last_spin_date FROM spins WHERE user_id = ?',
      [userId]
    );

    if (spinData.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentDate = new Date().toISOString().split('T')[0];  // วันที่ปัจจุบัน (YYYY-MM-DD)

    // รีเซ็ต spins_left ถ้าเป็นวันใหม่
    if (spinData[0].last_spin_date !== currentDate) {
      await connection.query(
        'UPDATE spins SET used_spins_today = 0, last_spin_date = ? WHERE user_id = ?',
        [currentDate, userId]
      );
    }

    return NextResponse.json(spinData[0], { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /api/spin:", error);
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}

// POST: หมุนวงล้อ
export async function POST(request: Request, { params }: { params: { user_id: string } }) {
  const userId = params.user_id;

  try {
    // 1️⃣ ตรวจสอบสิทธิ์การหมุนของผู้ใช้
    const [spinData]: [SpinHistory[], any] = await connection.query(
      'SELECT spin_count, used_spins_today, last_spin_date FROM spins WHERE user_id = ?',
      [userId]
    );

    if (!spinData || spinData[0].spin_count <= 0 || spinData[0].used_spins_today >= 5) {
      return NextResponse.json({ message: 'No spins left or daily limit reached' }, { status: 400 });
    }

    // 2️⃣ ดึงเมนูทั้งหมดจากฐานข้อมูล
    const [menus]: [Menu[], any] = await connection.query('SELECT * FROM menus WHERE status = 1');

    if (menus.length === 0) {
      return NextResponse.json({ message: 'No menus available' }, { status: 404 });
    }

    // 3️⃣ สุ่มเมนูที่ได้จากเมนูทั้งหมด
    const randomMenu = menus[Math.floor(Math.random() * menus.length)];

    // 4️⃣ ตรวจสอบว่าเมนูที่ได้เป็นเมนูลับหรือไม่
    const isSecret = randomMenu.is_secret;

    // 5️⃣ บันทึกประวัติการหมุน
    await connection.query(
      'INSERT INTO spin_history (user_id, menu_id, is_secret, spin_date) VALUES (?, ?, ?, NOW())',
      [userId, randomMenu.menu_id, isSecret]
    );

    // 6️⃣ อัปเดตจำนวนสิทธิ์การหมุน
    await connection.query(
      'UPDATE spins SET used_spins_today = used_spins_today + 1, spin_count = spin_count - 1 WHERE user_id = ?',
      [userId]
    );

    // ✅ ส่งข้อมูลเมนูที่ได้รับจากการหมุน
    return NextResponse.json({
      message: 'Spin completed',
      menu: {
        name: randomMenu.menu_name,
        price: randomMenu.price,
        menu_image: randomMenu.menu_image,
        is_secret: isSecret,
      },
    });
  } catch (error: any) {
    console.error("Error in POST /api/spin:", error);
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}
