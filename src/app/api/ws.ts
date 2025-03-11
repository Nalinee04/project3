// import { WebSocketServer, WebSocket } from "ws";
// import { NextApiRequest, NextApiResponse } from "next";
// import { IncomingMessage } from "http";

// // กำหนดประเภทของ wss
// const wss = new WebSocketServer({ noServer: true });

// // การเชื่อมต่อ WebSocket
// wss.on("connection", (ws: WebSocket) => {
//   console.log("🟢 Client Connected");

//   ws.on("message", (message: string | Buffer) => {
//     console.log("📩 Received:", message.toString());

//     // ส่งข้อมูลไปยังไคลเอนต์ทุกตัว (อัปเดตข้อมูลสถานะออเดอร์)
//     wss.clients.forEach((client) => {
//       if (client.readyState === 1) {
//         client.send(message.toString());
//       }
//     });
//   });

//   ws.on("close", () => console.log("🔴 Client Disconnected"));
// });

// // ฟังก์ชันอัปเดตสถานะออเดอร์
// function updateOrderStatus(orderId: string, newStatus: string) {
//   // อัปเดตสถานะออเดอร์ในฐานข้อมูล (MySQL)
//   // ตัวอย่างนี้คือการใช้ MySQL query เพื่อตั้งสถานะใหม่
//   // เรียกใช้ query อัปเดตสถานะของออเดอร์ในฐานข้อมูล
//   // เช่น:
//   // db.query("UPDATE orders SET status = ? WHERE id = ?", [newStatus, orderId]);

//   // เมื่ออัปเดตสถานะในฐานข้อมูลสำเร็จแล้ว
//   // ส่งการอัปเดตผ่าน WebSocket
//   const message = JSON.stringify({
//     orderId,
//     status: newStatus,
//   });

//   // ส่งข้อความไปยังไคลเอนต์ที่เชื่อมต่ออยู่
//   wss.clients.forEach((client) => {
//     if (client.readyState === 1) {
//       client.send(message);
//     }
//   });
// }

// // ตัวแปรที่เชื่อมต่อกับ http.Server
// declare global {
//   namespace NodeJS {
//     interface Global {
//       wss: WebSocketServer;
//     }
//   }
// }

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "GET") return res.status(405).end();

//   // ตรวจสอบว่า WebSocket server ถูกสร้างขึ้นแล้วหรือยัง
//   if (!res.socket.server.wss) {
//     console.log("🛠 Starting WebSocket Server...");

//     // ผูก WebSocket server กับ HTTP server
//     res.socket.server.on("upgrade", (request: IncomingMessage, socket: any, head: Buffer) => {
//       wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
//         wss.emit("connection", ws, request);
//       });
//     });

//     res.socket.server.wss = wss; // บันทึก WebSocket server
//   }

//   res.end();
// }
