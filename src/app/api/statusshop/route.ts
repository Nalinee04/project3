//statusshop
import { NextResponse } from "next/server";
import connection from "@/lib/db";
import { authenticateToken } from "@/lib/middleware";
import { JwtPayload } from "jsonwebtoken"; // นำเข้า JwtPayload จาก jsonwebtoken

interface UserWithShop extends JwtPayload {
  shop_id: string;
}

export async function GET(req: Request) {
  console.log("🔍 Header Authorization:", req.headers.get("Authorization"));

  const user = authenticateToken(req) as UserWithShop;  // ใช้ type assertion เพื่อให้ TypeScript รู้ว่า user เป็น UserWithShop
  console.log("🛠 ตรวจสอบ user ที่ decode ได้:", user);

  if (!user) {
    console.log("⛔ ไม่มี Token หรือ Token ไม่ถูกต้อง");
    return NextResponse.json({ error: "Forbidden: Invalid token" }, { status: 403 });
  }

  if (!user.shop_id) {
    console.log("⛔ ไม่มี shop_id ใน Token");
    return NextResponse.json({ error: "Forbidden: No shop access" }, { status: 403 });
  }

  try {
    if (!connection) throw new Error("Database connection is not established.");

    // เปลี่ยนการ query จากการใช้ array ปกติ เป็นการใช้ rows
    const [result]: any[] = await connection.query(
      `SELECT status FROM shops WHERE shop_id = ?`, 
      [user.shop_id]
    );

    // ตรวจสอบว่า result มีค่าหรือไม่
    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    // ตรวจสอบสถานะของร้าน
    console.log("📊 Shop Status:", result[0].status);
    return NextResponse.json({ status: result[0].status }, { status: 200 });

  } catch (error) {
    console.error("Error fetching shop status:", error);
    return NextResponse.json({ error: "Error fetching shop status" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
    console.log("🔍 Header Authorization:", req.headers.get("Authorization"));
  
    const user = authenticateToken(req) as UserWithShop;
    console.log("🛠 ตรวจสอบ user ที่ decode ได้:", user);
  
    if (!user) {
      console.log("⛔ ไม่มี Token หรือ Token ไม่ถูกต้อง");
      return NextResponse.json({ error: "Forbidden: Invalid token" }, { status: 403 });
    }
  
    if (!user.shop_id) {
      console.log("⛔ ไม่มี shop_id ใน Token");
      return NextResponse.json({ error: "Forbidden: No shop access" }, { status: 403 });
    }
  
    try {
      const body = await req.json();
      const { status } = body; // รับค่า status ที่จะอัปเดต (เช่น "open" หรือ "closed")
  
      if (!status) {
        return NextResponse.json({ error: "Status is required" }, { status: 400 });
      }
  
      if (!["open", "closed"].includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
  
      // ทำการอัปเดตสถานะร้าน
      const [result] = await connection.query(
        `UPDATE shops SET status = ? WHERE shop_id = ?`,
        [status, user.shop_id]
      );
  
      // ผลลัพธ์จะเป็นประเภท ResultSetHeader ดังนั้นต้องเข้าถึง affectedRows จาก result
      if ((result as any).affectedRows === 0) {
        return NextResponse.json({ error: "Shop not found or status not updated" }, { status: 404 });
      }
  
      console.log("📊 Shop status updated to:", status);
      return NextResponse.json({ message: "Shop status updated successfully", status }, { status: 200 });
  
    } catch (error) {
      console.error("Error updating shop status:", error);
      return NextResponse.json({ error: "Error updating shop status" }, { status: 500 });
    }
  }