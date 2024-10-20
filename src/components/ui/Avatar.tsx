// components/ui/avatar.tsx
import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: number; // ขนาดของ Avatar
  className?: string; // เพิ่ม className ที่นี่
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 40, className }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full ${className}`} // ใช้ className ที่ได้รับ
      style={{ width: size, height: size }}
    />
  );
};

export default Avatar;
