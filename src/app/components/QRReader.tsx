//qrreader

"use client";

import { useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const QRReader = () => {
  const [qrResult, setQrResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      if (reader.result) {
        const image = new Image();
        image.src = reader.result.toString();
        image.onload = async () => {
          try {
            const codeReader = new BrowserMultiFormatReader();
            const result = await codeReader.decodeFromImageElement(image);
            setQrResult(result.getText()); // ✅ แสดงผลข้อมูลจาก QR Code
            setError(null);
          } catch (err) {
            setError("❌ ไม่สามารถอ่าน QR Code ได้");
            console.error(err);
          }
        };
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">📤 อัปโหลด QR Code</h2>
      <input type="file" accept="image/*" onChange={handleFileUpload} className="mb-4" />
      
      {qrResult && <p className="text-green-600">✅ ข้อมูล QR: {qrResult}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default QRReader;
