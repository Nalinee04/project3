import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

const CanceledOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const canceledOrders = storedOrders.filter((order: any) => order.status === "Canceled");
    setOrders(canceledOrders);
  }, []);

  const columns = [
    { name: "Task", selector: (row: any) => row.orderNumber, sortable: true },
    { name: "ชื่อลูกค้า", selector: (row: any) => row.customerName, sortable: true },
    { name: "สินค้า", selector: (row: any) => row.productName, sortable: true },
    { name: "จำนวน", selector: (row: any) => row.quantity, sortable: true },
    { name: "สถานะ", selector: (row: any) => row.status, sortable: true },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">ออเดอร์ที่ยกเลิก</h1>
      <DataTable columns={columns} data={orders} pagination />
    </div>
  );
};

export default CanceledOrdersPage;
