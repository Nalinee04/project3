import { redirect } from 'next/navigation'; // นำเข้า redirect เพื่อใช้สำหรับการเปลี่ยนเส้นทาง

export default function Home() {
  // เปลี่ยนเส้นทางไปยังหน้า /login เมื่อผู้ใช้เข้าเว็บไซต์
  redirect('/roleres');

  return null; // หน้านี้จะไม่ถูกเรนเดอร์เนื่องจาก redirect
}
