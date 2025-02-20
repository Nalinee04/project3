// app/utils/SweetAlert.tsx
import Swal from "sweetalert2";

const SweetAlert = (isRaining: boolean, onConfirm: () => void) => {
  console.log("SweetAlert called with isRaining:", isRaining); // เพิ่มการล็อกเพื่อดูค่าที่ถูกส่งเข้ามา

  const gifUrl = isRaining
    ? "/images/Chef.gif"
    : "/images/Deliverytwo.gif";

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success me-2",
      cancelButton: "btn btn-danger ms-2",
    },
    buttonsStyling: false,
  });

  // แสดง SweetAlert เพื่อยืนยันการส่งคำสั่งซื้อ
  swalWithBootstrapButtons.fire({
    title: "ยืนยันการส่งคำสั่งซื้อใช่ไหม?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
    reverseButtons: false,
  }).then((result) => {
    if (result.isConfirmed) {
      console.log("Order confirmed."); // เพิ่มการล็อกเมื่อสั่งซื้อได้รับการยืนยัน
      if (isRaining) {
        handleRainAlert(gifUrl, onConfirm);
      } else {
        handleOrderSubmission(onConfirm);
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire({
        title: "ยกเลิก",
        text: "คำสั่งซื้อของคุณถูกยกเลิก :)",
        icon: "error",
      });
    }
  });
};

// ฟังก์ชันสำหรับส่งคำสั่งซื้อ
const handleOrderSubmission = (onConfirm: () => void) => {
  let timerInterval: ReturnType<typeof setInterval>;

  Swal.fire({
    title: "กำลังส่งคำสั่งซื้อ!",
    html: "โปรดรอ <b></b> วินาที...",
    timer: 3000, // ตั้งเวลา 5 วินาที
    timerProgressBar: true,
    didOpen: () => {
      const popup = Swal.getPopup();
      if (popup) {
        Swal.showLoading(Swal.getConfirmButton());
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
      console.log("Order confirmed and redirected to success page.");
      onConfirm(); // เรียกฟังก์ชันไปยัง success page
    }
  });
};

// ฟังก์ชันสำหรับแจ้งเตือนฝนตก
const handleRainAlert = (gifUrl: string, onConfirm: () => void) => {
  Swal.fire({
    title: "กำลังจัดเตรียมอาหาร โปรดรอซักครู่",
    imageUrl: gifUrl,
    imageHeight: 300,
    imageAlt: "เตรียมอาหาร",
    confirmButtonText: "รับทราบ",
  }).then(() => {
    console.log("Order confirmed with rain alert."); // เพิ่มการล็อกเมื่อมีการแจ้งเตือนฝนตก
    onConfirm(); // ไปยัง success page โดยอัตโนมัติ
  });
};

export default SweetAlert;
