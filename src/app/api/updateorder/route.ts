import { NextResponse } from 'next/server';
import connection from '@/lib/db';
import { ResultSetHeader, FieldPacket } from 'mysql2';
import { authenticateToken } from '@/lib/middleware';

export async function PUT(req: Request) {
    const user = authenticateToken(req);
    if (user instanceof NextResponse) return user; // ถ้าไม่ผ่านการตรวจสอบ token ให้คืนค่าตอบกลับที่ไม่อนุญาต

    const { order_id, status } = await req.json();

    if (!order_id || !status) {
        return NextResponse.json({ error: 'Missing required fields: order_id and status must be provided.' }, { status: 400 });
    }

    try {
        const [orderCheck]: [any[], FieldPacket[]] = await connection.query(
            'SELECT * FROM `orders` WHERE order_id = ?',
            [order_id]
        );

        if (!orderCheck.length) {
            return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
        }

        const [updateResult]: [ResultSetHeader, FieldPacket[]] = await connection.query(
            'UPDATE `orders` SET status = ? WHERE order_id = ?',
            [status, order_id]
        );

        if (updateResult.affectedRows === 0) {
            return NextResponse.json({ error: 'No changes made.' }, { status: 400 });
        }

        return NextResponse.json({ message: 'Order status updated successfully!' }, { status: 200 });
    } catch (error: unknown) {
        console.error('Error updating order status:', error);
        return NextResponse.json({ error: 'Error updating order status' }, { status: 500 });
    }
}
