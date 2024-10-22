import { NextResponse } from 'next/server';
import connection from '@/lib/db';
import { FieldPacket } from 'mysql2';
import { authenticateToken } from '@/lib/middleware';
import { URL } from 'url';

// ดึงข้อมูลคำสั่งซื้อทั้งหมด
export async function GET(req: Request) {
    const user = authenticateToken(req);
    if (user instanceof NextResponse) return user;

    // ดึง query parameters จาก URL
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    try {
        if (!connection) throw new Error("Database connection is not established.");

        // ใช้ prepared statement เพื่อป้องกัน SQL Injection
        const [orders]: [any[], FieldPacket[]] = await connection.query(
            'SELECT * FROM order_items WHERE order_id = ?',
            [id]
        );

        if (!orders || orders.length === 0) {
            return NextResponse.json({ message: 'No orders found' }, { status: 404 });
        }

        return NextResponse.json(orders, { status: 200 });
    } catch (error: unknown) {
        console.error('Error fetching order items:', error);
        return NextResponse.json({ error: 'Error fetching order items' }, { status: 500 });
    }
}
