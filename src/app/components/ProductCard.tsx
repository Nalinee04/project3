// src/app/components/ProductCard.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

type ProductCardProps = {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  onAddToCart: () => void;
};

const ProductCard: React.FC<ProductCardProps> = ({ title, description, imageUrl, price, onAddToCart }) => {
  return (
    <div className="border rounded-lg shadow p-4 flex flex-col items-center">
      <Image
        src={imageUrl}
        alt={title}
        width={150}
        height={150}
        className="rounded-md"
      />
      <h2 className="mt-4 text-lg font-bold">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
      <p className="mt-2 text-lg font-semibold">฿{price}</p>
      <Button className="mt-4" onClick={onAddToCart}>
        Add to Cart
      </Button>
    </div>
  );
};

export default ProductCard;
import React from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useCart } from '@/components/CartContext'; // Import useCart เพื่อใช้งาน

type ProductCardProps = {
  id: string; // เพิ่ม id เพื่อให้สามารถจัดการสินค้าในตะกร้าได้
  title: string;
  description: string;
  imageUrl: string;
  price: number;
};

const ProductCard: React.FC<ProductCardProps> = ({ id, title, description, imageUrl, price }) => {
  const { addToCart } = useCart(); // ใช้ addToCart จาก CartContext

  const handleAddToCart = () => {
    // เพิ่มสินค้าลงในตะกร้า
    addToCart({
      id,
      name: title,
      price,
      image: imageUrl,
      quantity: 1, // ค่าเริ่มต้นของจำนวนสินค้า
    });
  };

  return (
    <div className="border rounded-lg shadow p-4 flex flex-col items-center">
      <Image
        src={imageUrl}
        alt={title}
        width={150}
        height={150}
        className="rounded-md"
      />
      <h2 className="mt-4 text-lg font-bold">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
      <p className="mt-2 text-lg font-semibold">฿{price}</p>
      <Button className="mt-4" onClick={handleAddToCart}>
        Add to Cart
      </Button>
    </div>
  );
};

export default ProductCard;
