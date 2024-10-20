import React from 'react';

interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  orderNumber: string;
  customerName: string;
  items: Item[];
  status: string;
  shippingAddress: string;
  orderDate: string;
  waitingTime: string;
}

const BillDetail: React.FC<{ order: Order | null }> = ({ order }) => {
    if (!order) {
        return <p>Loading order details...</p>;  // Fallback when order is not available
    }

    const totalPrice = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="p-4 border rounded-lg shadow-lg bg-white">
            <h1 className="text-2xl font-bold mb-4">รายละเอียดคำสั่งซื้อ</h1>
            <p><strong>หมายเลขคำสั่ง:</strong> {order.orderNumber}</p>
            <p><strong>ชื่อลูกค้า:</strong> {order.customerName}</p>
            <p><strong>วันที่สั่งซื้อ:</strong> {order.orderDate}</p>
            <p><strong>สถานะ:</strong> {order.status}</p>

            <div className="mt-4">
                <h2 className="text-xl font-semibold">รายการสินค้า</h2>
                <ul className="list-disc list-inside">
                    {order.items.map((item) => (
                        <li key={item.id} className="flex items-center mt-2">
                            <img src={item.image} alt={item.name} className="w-16 h-16 mr-4" />
                            <div>
                                <p><strong>ชื่อสินค้า:</strong> {item.name}</p>
                                <p><strong>ราคา:</strong> {item.price} บาท</p>
                                <p><strong>จำนวน:</strong> {item.quantity}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <p className="mt-4"><strong>รวมทั้งหมด:</strong> {totalPrice} บาท</p>
            <p><strong>ที่อยู่จัดส่ง:</strong> {order.shippingAddress ? order.shippingAddress : "ไม่มีข้อมูล"}</p>
        </div>
    );
};

export default BillDetail;
