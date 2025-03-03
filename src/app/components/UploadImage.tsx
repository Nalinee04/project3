"use client";

import { useState } from "react";

const UploadImage = ({ onImageUpload }: { onImageUpload: (url: string) => void }) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // เช็กว่าไฟล์เป็นรูปภาพหรือไม่
      if (!file.type.startsWith("image/")) {
        setError("กรุณาเลือกรูปภาพเท่านั้น");
        return;
      }

      // จำกัดขนาดไฟล์ไม่เกิน 5MB
      if (file.size > 5 * 1024 * 1024) {
        setError("ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 5MB)");
        return;
      }

      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!image) return setError("กรุณาเลือกรูปภาพ");
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "menu_upload"); // เปลี่ยนเป็น preset จริง

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dpzxehkc3/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        onImageUpload(data.secure_url); // ส่ง URL กลับไปให้ AddMenu
        setImage(null);
        setPreview(null);
      } else {
        setError("อัปโหลดรูปภาพล้มเหลว");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    setError(null);
  };

  return (
    <div className="space-y-2">
      <input type="file" onChange={handleImageChange} accept="image/*" className="border p-2 w-full" />

      {preview && (
        <div className="flex items-center gap-2">
          <img src={preview} alt="Preview" className="w-32 h-32 object-cover mt-2" />
          <button onClick={handleRemoveImage} className="text-red-500 text-sm">ลบรูป</button>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button onClick={handleUpload} disabled={!image || uploading} className="bg-blue-500 text-white px-4 py-2 rounded">
        {uploading ? "กำลังอัปโหลด..." : "อัปโหลดรูป"}
      </button>
    </div>
  );
};

export default UploadImage;
