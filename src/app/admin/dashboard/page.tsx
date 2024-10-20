"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import WaitingTime from "../../components/WaitingTime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUtensils,
  faFileAlt,
  faSignOutAlt,
  faShoppingCart,
  faCheckCircle,
  faTimesCircle,
  faCloudRain,
} from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import { Separator } from "@/components/ui/separator";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Order {
  order_id: string; // เปลี่ยนเป็น order_id
  order_number: string; // เปลี่ยนเป็น order_Number
  customer_name: string; // เปลี่ยนเป็น customer_name
  totalAmount: number; // เพิ่มฟิลด์ totalAmount
  shipping_address?: string; // หากมีข้อมูลนี้ใน API ให้เพิ่ม
  created_at: string; // เปลี่ยนเป็น created_at
  deliveryTime: string; // เพิ่มฟิลด์ deliveryTime
  status: string;
  is_rainy?: boolean; // เปลี่ยนเป็น is_rainy
}

const DashboardPage = () => {
  const router = useRouter();
  const [content, setContent] = useState("dashboard");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [newStatus, setNewStatus] = useState("");
  const [username, setUsername] = useState("ไม่ทราบชื่อผู้ใช้");

  // ฟังก์ชันสำหรับดึงข้อมูลคำสั่งซื้อจาก API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        const updatedOrders = data.map((order: Order) => ({
          ...order,
          isRainy: order.is_rainy || false,
          status: order.is_rainy ? "ล้าช้า" : order.status,
          deliveryTime: order.deliveryTime || null, // เพิ่มการจัดการ deliveryTime
          totalAmount: order.totalAmount || 0, // เพิ่มการจัดการ totalAmount
        }));
        setOrders(updatedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchUsername = () => {
      const usernameFromStorage = localStorage.getItem("username");
      if (usernameFromStorage) {
        setUsername(usernameFromStorage);
      }
    };

    fetchOrders();
    fetchUsername();
  }, []);

  interface OrderItem {
    price: number;
    quantity: number;
  }
  // ฟังก์ชันสำหรับคำนวณยอดรวมคำสั่งซื้อ
  const calculateTotalAmount = async (orderId: string) => {
    try {
      const response = await fetch(`/api/order_items?orderId=${orderId}`);
      const items: OrderItem[] = await response.json(); // ระบุประเภทให้กับ items
      
      const total = items.reduce((sum: number, item: OrderItem) => sum + item.price * item.quantity, 0);
      
      // อัปเดต totalAmount ใน orders table
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ totalAmount: total }), // ฟิลด์ totalAmount ต้องตรงกับฐานข้อมูล
      });
    } catch (error) {
      console.error("Error calculating total amount:", error);
    }
  };
  

   // ฟังก์ชันสำหรับจัดการลบคำสั่งซื้อ
const handleDeleteOrder = async (orderId: string) => {
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("ไม่สามารถลบคำสั่งซื้อได้");
    }

    const updatedOrders = orders.filter(
      (order) => order.order_id !== orderId
    );
    setOrders(updatedOrders);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting order:", error.message);
      alert(error.message); // แสดงข้อความข้อผิดพลาด
    } else {
      console.error("Unknown error occurred", error);
      alert("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
    }
  }
};



  // ฟังก์ชันสำหรับอัปเดตสถานะคำสั่งซื้อ
  const handleCheckboxChange = async (orderId: string) => {
    const updatedSelectedOrders = selectedOrders.includes(orderId)
      ? selectedOrders.filter((id) => id !== orderId)
      : [...selectedOrders, orderId];
  
    setSelectedOrders(updatedSelectedOrders);
  
    if (newStatus !== "") {
      try {
        await fetch(`/api/orders/${orderId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });
  
        // เรียกใช้ฟังก์ชันคำนวณยอดรวมหลังจากอัปเดตสถานะ
        await calculateTotalAmount(orderId);
  
        const updatedOrders = orders.map((order) =>
          updatedSelectedOrders.includes(order.order_id)
            ? { ...order, status: newStatus }
            : order
        );
        setOrders(updatedOrders);
      } catch (error) {
        console.error("Error updating order status:", error);
      }
    }
  };

  // ฟังก์ชัน handleViewBill พร้อมการกำหนดประเภทข้อมูล order
  const handleViewBill = (order: Order) => {
    const params = new URLSearchParams();
    params.append("order", JSON.stringify(order));
    router.push(`/admin/billDetail?${params.toString()}`);
  };

  // ฟังก์ชันสำหรับออกจากระบบ
  const handleLogout = () => {
    router.push("/admin/loginadmin");
  };

  // ฟังก์ชันสำหรับคำนวณยอดคำสั่งซื้อ
  const calculateTodayOrders = () => {
    const today = new Date().toDateString();
    return orders.filter(
      (order) => new Date(order.created_at).toDateString() === today // เปลี่ยนเป็น created_at
    ).length;
  };

  const calculateCompletedOrders = () => {
    return orders.filter((order) => order.status === "จัดส่งแล้ว").length;
  };

  const calculatePendingOrders = () => {
    return orders.filter((order) => order.status !== "จัดส่งแล้ว").length;
  };

  const calculateRainyOrders = () => {
    return orders.filter((order) => order.is_rainy).length; // เปลี่ยนเป็น is_rainy
  };

  const columns = [
    {
      name: "",
      cell: (row: Order) => (
        <input
          type="checkbox"
          checked={selectedOrders.includes(row.order_id)} // เปลี่ยนเป็น order_id
          onChange={() => handleCheckboxChange(row.order_id)} // เปลี่ยนเป็น order_id
          className="mr-2"
        />
      ),
      width: "60px",
    },
    {
      name: "หมายเลขคำสั่งซื้อ",
      selector: (row: Order) => row.order_number, 
      sortable: true,
    },
    {
      name: "เวลาที่รอ",
      cell: (row: Order) => (
        <WaitingTime orderTime={new Date(row.created_at)} status={row.status} /> 
      ),
      sortable: true,
    },
    {
      name: "ยอดเงิน",
      selector: (row: Order) => row.totalAmount, // อาจต้องเพิ่มใน Order ถ้ามี
      sortable: true,
    },
    {
      name: "ชื่อลูกค้า",
      selector: (row: Order) => row.customer_name, // เปลี่ยนเป็น customer_name
      sortable: true,
    },
    {
      name: "ดูบิล",
      cell: (row: Order) => (
        <button
          onClick={() => handleViewBill(row)}
          className="flex items-center"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon
            icon={faFileAlt}
            className="text-black"
            style={{ fontSize: "1.5rem" }}
          />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "เวลาที่ลูกค้าเริ่มสั่ง",
      selector: (row: Order) => row.created_at, // เปลี่ยนเป็น created_at
      sortable: true,
    },
    {
      name: "เวลาที่ลูกค้าได้รับสินค้า",
      selector: (row: Order) =>row.deliveryTime,
      sortable: true,
    },
    {
      name: "สถานะออเดอร์",
      selector: (row: Order) =>row.status,
      sortable: true,
    },
  ];
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-[124px] h-screen bg-[#2C2C2C] text-white p-4">
        <div className="mb-8 flex justify-center">
          <div className="w-[200px] h-[98px] rounded-full overflow-hidden bg-white flex items-center justify-center mx-auto">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={150}
              height={150}
              className="object-cover"
            />
          </div>
        </div>
        <Separator />
        <ul className="space-y-4 gap-10 flex flex-col pt-10">
          <li
            className={`flex flex-col items-center gap-1 cursor-pointer ${
              content === "dashboard" ? "text-blue-400" : ""
            }`}
            onClick={() => setContent("dashboard")}
          >
            <FontAwesomeIcon icon={faHome} className="text-2xl" />
            <span>หน้าหลัก</span>
          </li>
          <li
            className={`flex flex-col items-center gap-1 cursor-pointer ${
              content === "addProduct" ? "text-blue-400" : ""
            }`}
            onClick={() => setContent("addProduct")}
          >
            <FontAwesomeIcon icon={faUtensils} className="text-2xl" />
            <span>จัดการเมนู</span>
          </li>
          <li
            className={`flex flex-col items-center gap-1 cursor-pointer ${
              content === "report" ? "text-blue-400" : ""
            }`}
            onClick={() => setContent("report")}
          >
            <FontAwesomeIcon icon={faFileAlt} className="text-2xl" />
            <span>รายงาน</span>
          </li>
          <li
            className="flex flex-col items-center gap-1 cursor-pointer"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="text-2xl" />
            <span>ออกจากระบบ</span>
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="w-full p-4">
        {content === "dashboard" && (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <div className="flex items-center gap-4">
                <span>{username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg transition-transform hover:scale-105"
                >
                  ออกจากระบบ
                </button>
              </div>
            </div>

            {/* Date Picker and Area */}
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
              <h2 className="font-bold text-lg mb-4">เลือกวันที่และพื้นที่</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <label className="mr-2">วันที่:</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date as Date)}
                    className="border rounded-lg p-2"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                <div className="flex items-center">
                  <label className="mr-2">พื้นที่:</label>
                  <span className="border rounded-lg p-2 bg-gray-100">
                    ทับสะแก
                  </span>
                </div>
              </div>
            </div>

            {/* Dashboard Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-r from-gray-200 to-gray-400 p-6 rounded-lg shadow-lg text-center text-gray-800 transition-transform hover:scale-105">
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  className="text-3xl mb-2"
                />
                <h2 className="font-bold text-lg">ออเดอร์วันนี้</h2>
                <p className="text-2xl">{calculateTodayOrders()}</p>
              </div>
              <div className="bg-gradient-to-r from-gray-200 to-gray-400 p-6 rounded-lg shadow-lg text-center text-gray-800 transition-transform hover:scale-105">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-3xl mb-2"
                />
                <h2 className="font-bold text-lg">ออเดอร์ที่เสร็จแล้ว</h2>
                <p className="text-2xl">{calculateCompletedOrders()}</p>
              </div>
              <div className="bg-gradient-to-r from-gray-200 to-gray-400 p-6 rounded-lg shadow-lg text-center text-gray-800 transition-transform hover:scale-105">
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  className="text-3xl mb-2"
                />
                <h2 className="font-bold text-lg">ออเดอร์ที่ค้าง</h2>
                <p className="text-2xl">{calculatePendingOrders()}</p>
              </div>
              <div className="bg-gradient-to-r from-gray-200 to-gray-400 p-6 rounded-lg shadow-lg text-center text-gray-800 transition-transform hover:scale-105">
                <FontAwesomeIcon icon={faCloudRain} className="text-3xl mb-2" />
                <h2 className="font-bold text-lg">ออเดอร์ที่ฝนตก</h2>
                <p className="text-2xl">{calculateRainyOrders()}</p>{" "}
                {/* แสดงผลจำนวนออเดอร์ที่ฝนตก */}
              </div>
            </div>

            {/* Order Table with DataTable */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="font-bold mb-4 text-xl">คำสั่งซื้อ</h2>
              <div className="flex justify-between mb-4">
                <div className="flex gap-4">
                  <select
                    className="border p-2 rounded-lg"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)} // Update status based on selection
                  >
                    <option value="" disabled hidden>
                      เปลี่ยนสถานะ
                    </option>{" "}
                    {/* This is the disabled label */}
                    <option value="รอดำเนินการ">รอดำเนินการ</option>
                    <option value="เตรียมของจัดส่ง">เตรียมของจัดส่ง</option>
                    <option value="กำลังจัดส่ง">กำลังจัดส่ง</option>
                    <option value="จัดส่งแล้ว">จัดส่งแล้ว</option>
                  </select>
                </div>
                <input
                  type="text"
                  className="border p- rounded-lg"
                  placeholder="ค้นหา"
                />
              </div>

              {/* DataTable */}
              <DataTable columns={columns} data={orders} pagination />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
