import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions"; // ✅ แก้ import ให้ถูกต้อง
import connection from "@/lib/db";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const query = "SELECT user_id AS id, name, phone, image FROM users WHERE user_id = ?";
    const [rows]: [RowDataPacket[], any] = await connection.query(query, [session.user.id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error: any) {
    console.error("🚨 Error in GET /api/edit:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, phone, password, image } = await req.json();
    if (!name || !phone) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    let updateQuery = "UPDATE users SET name = ?, phone = ?, image = ? WHERE user_id = ?";
    let queryParams = [name, phone, image, session.user.id];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery = "UPDATE users SET name = ?, phone = ?, password = ?, image = ? WHERE user_id = ?";
      queryParams = [name, phone, hashedPassword, image, session.user.id];
    }

    const [result]: any = await connection.query(updateQuery, queryParams);
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "ไม่สามารถอัปเดตข้อมูลได้" }, { status: 500 });
    }

    return NextResponse.json({ message: "อัปเดตข้อมูลสำเร็จ", image }, { status: 200 });
  } catch (error: any) {
    console.error("🚨 Error in PUT /api/edit:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
