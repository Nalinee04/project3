// src/app/api/user/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/lib/user"; // ตรวจสอบให้แน่ใจว่าเส้นทางถูกต้อง

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 });
  }

  try {
    const user = await getUserById(Number(id)); // แปลง id เป็น number
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("🚨 Error fetching user:", error);
    return NextResponse.json({ message: "Error fetching user" }, { status: 500 });
  }
}
