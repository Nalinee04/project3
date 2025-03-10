import { NextResponse } from "next/server";
import connection from "@/lib/db";
import { authenticateToken } from "@/lib/middleware";
import { JwtPayload } from "jsonwebtoken";

interface UserWithShop extends JwtPayload {
  shop_id: string;
}

let shopStatusSubscribers: any[] = []; // เก็บ SSE Clients

export async function GET(req: Request) {
  const url = new URL(req.url);
  const isSSE = url.searchParams.get("stream") === "true"; // เช็คว่ามีการขอใช้ SSE ไหม

  if (isSSE) {
    const stream = new ReadableStream({
      start(controller) {
        const sendStatus = (status: string) => {
          controller.enqueue(`data: ${JSON.stringify({ status })}\n\n`);
        };

        shopStatusSubscribers.push(sendStatus);
        console.log("📡 Client connected to SSE");

        req.signal.addEventListener("abort", () => {
          shopStatusSubscribers = shopStatusSubscribers.filter((s) => s !== sendStatus);
          console.log("❌ Client disconnected from SSE");
        });
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  }

  // ดึงค่าปกติ
  const user = authenticateToken(req) as UserWithShop;
  if (!user?.shop_id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const [result]: any[] = await connection.query(
      `SELECT status FROM shops WHERE shop_id = ?`,
      [user.shop_id]
    );

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    return NextResponse.json({ status: result[0].status }, { status: 200 });

  } catch (error) {
    console.error("Error fetching shop status:", error);
    return NextResponse.json({ error: "Error fetching shop status" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const user = authenticateToken(req) as UserWithShop;
  if (!user?.shop_id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { status } = await req.json();
    if (!["open", "closed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const [result] = await connection.query(
      `UPDATE shops SET status = ? WHERE shop_id = ?`,
      [status, user.shop_id]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: "Shop not found or status not updated" }, { status: 404 });
    }

    // 🔥 Broadcast สถานะไปยังทุก Client ที่เชื่อมต่ออยู่
    shopStatusSubscribers.forEach((sendStatus) => sendStatus(status));
    console.log("📢 Broadcast shop status:", status);

    return NextResponse.json({ message: "Shop status updated successfully", status }, { status: 200 });

  } catch (error) {
    console.error("Error updating shop status:", error);
    return NextResponse.json({ error: "Error updating shop status" }, { status: 500 });
  }
}
