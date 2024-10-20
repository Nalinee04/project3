// app/api/forgotpassword/route.ts
import { NextResponse } from "next/server";
import emailjs from "emailjs-com"; // Import EmailJS SDK
import connection from "@/lib/db";
import validator from "validator";
import { RowDataPacket } from "mysql2";
import { v4 as uuidv4 } from "uuid"; // ติดตั้ง uuid เพื่อสร้าง Token

interface User {
  user_id: number;
  email: string;
}

export async function POST(request: Request) {
  try {
    // เริ่มต้นการประมวลผลคำขอ
    console.log("Starting password reset process");

    const { email } = await request.json();
    console.log("Received email:", email);

    // ตรวจสอบรูปแบบของอีเมล
    if (!validator.isEmail(email)) {
      console.log("Invalid email format");
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // ตรวจสอบอีเมลในฐานข้อมูล
    console.log("Checking email in database");
    const [rows]: [RowDataPacket[], any] = await connection.query(
      "SELECT user_id, email FROM users WHERE email = ?",
      [email]
    );
    console.log("Database query result:", rows);

    if (rows.length === 0) {
      console.log("Email not found in database");
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    const user: User = rows[0] as User;

    // สร้าง token ด้วย uuid
    const token = uuidv4(); // สร้าง Token ที่ไม่ซ้ำกัน
    const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`;

    // บันทึกโทเค็นในฐานข้อมูล
    console.log("Updating token in the database for user ID:", user.user_id);
    await connection.query(
      'UPDATE users SET reset_token = ? WHERE user_id = ?',
      [token, user.user_id]
    );

    // Log Token และ Link ที่สร้างขึ้น
    console.log("Generated Token:", token);
    console.log("Reset Link:", resetLink);

    // ตั้งค่าข้อมูลเพื่อส่งอีเมล
    const templateParams = {
      email: email,
      reset_link: resetLink, // ใช้ลิงก์ที่สร้างขึ้น
    };

    // ส่งอีเมลผ่าน EmailJS
    console.log("Sending email with params:", templateParams);
    const response = await emailjs.send(
      "service_czuhh5b", // เปลี่ยนเป็น Service ID ของคุณ
      "template_2u34l2v", // เปลี่ยนเป็น Template ID ของคุณ
      templateParams,
      "LptTg4CJuNL63rQJ0" // เปลี่ยนเป็น User ID ของคุณ
    );

    console.log("Email sent successfully!", response);

    return NextResponse.json({
      message: "Reset password link sent to your email",
    });
  } catch (error) {
    console.error("Error in /api/forgotpassword:", error);
    return NextResponse.json(
      {
        error:
          "An error occurred while processing your request. Please try again later.",
      },
      { status: 500 }
    );
  }
}
