import React from 'react';

interface NotificationProps {
  message: string | null;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  if (!message) return null; // ไม่แสดงถ้าไม่มีข้อความ

  return (
    <div className="fixed bottom-5 right-5 bg-blue-500 text-white p-4 rounded shadow-lg">
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-lg font-bold">&times;</button>
      </div>
    </div>
  );
};

export default Notification;
