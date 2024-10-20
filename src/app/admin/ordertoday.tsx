import React, { useEffect } from "react";

const OrderToday = () => {
  useEffect(() => {
    const mockOrders = [
      {
        orderNumber: "001",
        customerName: "John Doe",
        productName: "Product 1",
        quantity: 2,
        status: "Pending",
        orderTime: new Date().toISOString()
      },
      {
        orderNumber: "002",
        customerName: "Jane Smith",
        productName: "Product 2",
        quantity: 1,
        status: "Canceled",
        orderTime: new Date().toISOString()
      }
    ];

    localStorage.setItem("orders", JSON.stringify(mockOrders));  // เพิ่มข้อมูลจำลองลงใน localStorage
    console.log("Mock Orders Added to localStorage:", mockOrders);  // แสดงข้อมูลจำลองที่เพิ่มลงใน console
  }, []);

  return <div>แสดงออเดอร์วันนี้</div>;
};

export default OrderToday;
