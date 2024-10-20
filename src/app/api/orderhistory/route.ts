import { NextResponse } from 'next/server';
import connection from '@/lib/db';
import { FieldPacket } from 'mysql2';
import { authenticateToken } from '@/lib/middleware';

export async function GET(req: Request) {
    const user = authenticateToken(req);
    if (user instanceof NextResponse) return user;

    try {
        if (!connection) throw new Error("Database connection is not established.");

        // ดึงข้อมูลคำสั่งซื้อของผู้ใช้จากฐานข้อมูล
        const [orders]: [any[], FieldPacket[]] = await connection.query(
            'SELECT * FROM orders WHERE customer_id = ?',
            [user.id] // สมมติว่า user.id คือ ID ของผู้ใช้ที่ล็อกอิน
        );

        if (!orders || orders.length === 0) {
            return NextResponse.json({ message: 'No orders found' }, { status: 404 });
        }

        const ordersWithItems = await Promise.all(
            orders.map(async (order) => {
                const [items]: [any[], FieldPacket[]] = await connection.query(
                    'SELECT * FROM order_items WHERE order_id = ?',
                    [order.order_id]
                );

                return {
                    ...order,
                    items: items.map((item) => ({
                        item_id: item.item_id,
                        product_name: item.product_name,
                        price: item.price,
                        quantity: item.quantity,
                        image_url: item.image_url,
                    })),
                };
            })
        );

        return NextResponse.json(ordersWithItems, { status: 200 });
    } catch (error: unknown) {
        console.error('Error fetching order history:', error);
        return NextResponse.json({ error: 'Error fetching order history' }, { status: 500 });
    }
}
