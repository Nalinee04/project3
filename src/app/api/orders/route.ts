import { NextResponse } from 'next/server';
import connection from '@/lib/db';
import { FieldPacket } from 'mysql2';
import { authenticateToken } from '@/lib/middleware';

// ดึงข้อมูลคำสั่งซื้อทั้งหมด
export async function GET(req: Request) {
    const user = authenticateToken(req);
    if (user instanceof NextResponse) return user;

    try {
        if (!connection) throw new Error("Database connection is not established.");

        const [orders]: [any[], FieldPacket[]] = await connection.query('SELECT * FROM `orders`');

        if (!orders || orders.length === 0) {
            return NextResponse.json({ message: 'No orders found' }, { status: 404 });
        }

        return NextResponse.json(orders, { status: 200 });
    } catch (error: unknown) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 });
    }
}

// เพิ่มคำสั่งซื้อใหม่
export async function POST(req: Request) {
    const user = authenticateToken(req);
    if (user instanceof NextResponse) return user;

    const { order_number, customer_name, shipping_address, status = 'Pending', is_rainy, deliveryTime, items } = await req.json();

    if (!customer_name || !shipping_address || !items || !Array.isArray(items) || items.length === 0 || !shipping_address.trim()) {
        return NextResponse.json({ error: 'Missing required fields: customer_name, shipping_address, and items must be provided.' }, { status: 400 });
    }

    const areItemsValid = items.every(item => {
        return item.product_name && item.price > 0 && item.quantity > 0;
    });

    if (!areItemsValid) {
        return NextResponse.json({ error: 'Invalid item data. Each item must have a valid product name, price greater than zero, and quantity greater than zero.' }, { status: 400 });
    }

    try {
        const totalAmount = items.reduce((total: number, item: { price: number; quantity: number }) => total + item.price * item.quantity, 0);
        const orderNum = order_number || `Task-${Date.now()}`;

        const [orderResult]: [ResultSetHeader, FieldPacket[]] = await connection.query(
            'INSERT INTO `orders` (order_number, customer_name, shipping_address, status, is_rainy, deliveryTime, totalAmount) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [orderNum, customer_name, shipping_address, status, is_rainy, deliveryTime, totalAmount]
        );

        const orderId = orderResult.insertId;

        for (const item of items) {
            if (!item.product_name || !item.price || !item.quantity) {
                throw new Error('Item missing required fields');
            }

            await connection.query(
                'INSERT INTO order_items (order_id, product_name, price, quantity, image_url) VALUES (?, ?, ?, ?, ?)',
                [orderId, item.product_name, item.price, item.quantity, item.image_url]
            );
        }

        const savedOrder = {
            order_number: orderNum,
            customer_name,
            shipping_address,
            status,
            deliveryTime,
            totalAmount,
            items,
        };

        return NextResponse.json({ message: 'Order saved successfully!', order: savedOrder }, { status: 200 });
    } catch (error: unknown) {
        console.error('Error saving order:', error);
        return NextResponse.json({ error: 'Error saving order' }, { status: 500 });
    }
}
