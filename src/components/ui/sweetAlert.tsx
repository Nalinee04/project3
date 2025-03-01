// app/components/ui/SweetAlert.tsx
import { useEffect } from "react";
import Swal from "sweetalert2";

interface SweetAlertProps {
  orderStatus: string; // รับค่าจาก props เพื่อใช้ตรวจสอบสถานะ
  onConfirm: () => void;
}

const SweetAlert: React.FC<SweetAlertProps> = ({ orderStatus, onConfirm }) => {
  useEffect(() => {
    if (orderStatus === "เสร็จแล้ว") {
      Swal.fire({
        title: "<h3 style='font-size: 18px; font-weight: bold;'>คำสั่งซื้อของคุณเสร็จแล้ว 🎉</h3>",
        html: "<p style='font-size: 14px;'>กรุณามารับอาหารของคุณได้เลย!</p>",
        icon: "success",
        confirmButtonText: "รับทราบ",
        confirmButtonColor: "#facc15",
        width: "350px", // ✅ ใช้แค่ width
        customClass: {
          popup: "custom-alert-popup",
          confirmButton: "custom-confirm-button",
        },
      }).then(() => {
        onConfirm();
      }); // ✅ ปิดวงเล็บที่ถูกต้อง
    }
  }, [orderStatus, onConfirm]);

  const showConfirmAlert = () => {
    Swal.fire({
      title: "ยืนยันการส่งคำสั่งซื้อใช่ไหม?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      reverseButtons: false,
    }).then((result) => {
      if (result.isConfirmed) {
        handleOrderSubmission();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "ยกเลิก",
          text: "คำสั่งซื้อของคุณถูกยกเลิก :)",
          icon: "error",
        });
      }
    });
  };

  
  const handleOrderSubmission = () => {
    let timerInterval: ReturnType<typeof setInterval>;
  
    Swal.fire({
      title: "กำลังส่งคำสั่งซื้อ!",
      html: "โปรดรอ <b></b> วินาที...",
      timer: 3000, // ตั้งเวลา 3 วินาที
      timerProgressBar: true,
      didOpen: () => {
        const popup = Swal.getPopup();
        if (popup) {
          const confirmButton = Swal.getConfirmButton();
          if (confirmButton) {
            Swal.showLoading(confirmButton); // ✅ แก้ไขตรงนี้
          }
  
          const timer = popup.querySelector("b");
          if (timer) {
            timerInterval = setInterval(() => {
              const timerLeft = Swal.getTimerLeft();
              if (timerLeft !== undefined) {
                timer.textContent = `${Math.ceil(timerLeft / 1000)}`;
              }
            }, 100);
          }
        }
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        onConfirm(); // ✅ เรียกฟังก์ชันหลังจากส่งสำเร็จ
      }
    });
  };
  

  return null; // ✅ คอมโพเนนต์ไม่มี UI โดยตรง แค่ทำหน้าที่แจ้งเตือน
};

export default SweetAlert;
