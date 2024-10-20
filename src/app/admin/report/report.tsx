import { useState, useEffect } from 'react';

// สมมุติว่ามี API เพื่อดึงข้อมูลออเดอร์และอัปเดตสถานะ
const fetchOrders = async () => {
  const response = await fetch('/api/orders');
  return response.json();
};

const updateOrderStatus = async (orderId: number, status: string) => {
  await fetch(`/api/orders/${orderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
};

const checkWeather = async (latitude: string, longitude: string) => {
  const weatherResponse = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${latitude},${longitude}`
  );
  const weatherData = await weatherResponse.json();
  // สมมุติว่าเราตรวจสอบฝนตกโดยดูจาก weatherData
  const isRaining = weatherData.current.condition.text.includes('Rain');
  return isRaining;
};

export default function Report() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      const orders = await fetchOrders();
      setOrders(orders);
    };
    loadOrders();
  }, []);

  const handleCheckWeatherAndUpdate = async (orderId: number, latitude: string, longitude: string) => {
    const isRaining = await checkWeather(latitude, longitude);
    if (isRaining) {
      await updateOrderStatus(orderId, 'ล่าช้าจากฝนตก');
      alert(`ออเดอร์ ${orderId} ได้อัปเดตสถานะเป็น "ล่าช้าจากฝนตก"`);
      // โหลดข้อมูลออเดอร์ใหม่เพื่ออัปเดตหน้าเว็บ
      const updatedOrders = await fetchOrders();
      setOrders(updatedOrders);
    } else {
      alert(`ออเดอร์ ${orderId} สภาพอากาศปกติ ไม่มีการล่าช้า`);
    }
  };

  return (
    <div>
      <h2>Order Report</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Status</th>
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer_name}</td>
              <td className={order.status === 'ล่าช้าจากฝนตก' ? 'text-red-500 font-bold' : ''}>{order.status}</td>
              <td>
                <button
                  onClick={() => handleCheckWeatherAndUpdate(order.id, order.latitude, order.longitude)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  ตรวจสอบฝนตก
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
