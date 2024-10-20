import React, { useEffect, useState } from 'react';

// ประกาศ interface สำหรับข้อมูลแต่ละ order
interface Order {
    order_id: string;
    order_number: string;
    customer_name: string;
    totalAmount: number;
    shipping_address?: string;
    created_at: string;
    deliveryTime: string;
    status: string;
    is_rainy?: boolean;
    items: {
        item_id: string;
        product_name: string;
        price: number;
        quantity: number;
        image_url: string;
    }[];
}

// ประกาศ interface สำหรับ props ของ OrderHistory
interface OrderHistoryProps {
    orders: Order[]; // รับ orders เป็น props
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => { // เพิ่ม props ที่รับเข้ามา
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // ฟังก์ชัน fetchOrderHistory จะไม่ใช้ในที่นี้
    // const fetchOrderHistory = async () => { ... }

    // useEffect ไม่ต้องใช้ในที่นี้
    // useEffect(() => {
    //     fetchOrderHistory();
    // }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="mt-4">
            <h2 className="text-lg font-semibold">ประวัติการสั่งซื้อ</h2>
            <ul className="mt-2">
                {orders.map((order) => (
                    <li key={order.order_id} className="border-b py-2">
                        <div>หมายเลขคำสั่งซื้อ: {order.order_number}</div>
                        <div>ชื่อผู้สั่ง: {order.customer_name}</div>
                        <div>ที่อยู่จัดส่ง: {order.shipping_address}</div>
                        <div>สถานะ: {order.status}</div>
                        <div>วันที่สั่งซื้อ: {new Date(order.created_at).toLocaleDateString()}</div>
                        <div>เวลาจัดส่ง: {order.deliveryTime}</div>
                        <div>จำนวนเงินทั้งหมด: {order.totalAmount} บาท</div>
                        <ul className="ml-4">
                            {order.items.map(item => (
                                <li key={item.item_id}>
                                    <div>สินค้า: {item.product_name}</div>
                                    <div>จำนวน: {item.quantity}</div>
                                    <div>ราคา: {item.price} บาท</div>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderHistory;
