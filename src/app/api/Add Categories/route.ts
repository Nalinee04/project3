import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // ใช้ Prisma หรือ ORM ที่คุณใช้งาน

export async function POST(req: Request) {
    try {
        const { category_name } = await req.json();

        if (!category_name) {
            return NextResponse.json({ error: 'กรุณาใส่ชื่อประเภทสินค้า' }, { status: 400 });
        }

        const newCategory = await prisma.category.create({
            data: { name: category_name },
        });

        return NextResponse.json({ success: true, category: newCategory });
    } catch (error) {
        return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการเพิ่มประเภทสินค้า' }, { status: 500 });
    }
}
