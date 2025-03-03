import { NextResponse } from "next/server";
import connection from "@/lib/db";
import { FieldPacket, ResultSetHeader } from "mysql2";
import { authenticateToken } from "@/lib/middleware";
import { JwtPayload } from "jsonwebtoken"; // เพิ่มเพื่อใช้ type ตรวจสอบ

export async function GET(req: Request) {
  const user = authenticateToken(req) as JwtPayload | null;

  if (!user || !user.shop_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const query = `SELECT shop_id, shop_name, phone_number, shop_image FROM shops WHERE shop_id = ?`;
    const [rows]: [any[], FieldPacket[]] = await connection.query(query, [user.shop_id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching shop details:", error);
    return NextResponse.json({ error: "Error fetching shop details" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const user = authenticateToken(req) as JwtPayload | null;

  if (!user || !user.shop_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { shop_name, phone_number, password, shop_image } = await req.json();

    if (!shop_name || !phone_number || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const query = `
      UPDATE shops
      SET shop_name = ?, phone_number = ?, password = ?, shop_image = ?
      WHERE shop_id = ?
    `;
    const [result]: [ResultSetHeader, FieldPacket[]] = await connection.query(query, [
      shop_name, phone_number, password, shop_image, user.shop_id,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Shop not found or no changes made" }, { status: 404 });
    }

    return NextResponse.json({ message: "Shop details updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating shop details:", error);
    return NextResponse.json({ error: "Error updating shop details" }, { status: 500 });
  }
}
