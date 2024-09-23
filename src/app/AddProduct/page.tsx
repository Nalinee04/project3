"use client";

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AddProductPage = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null); 
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // สำหรับแสดงสถานะการโหลด
  const [error, setError] = useState(''); // สำหรับแสดงข้อผิดพลาด

  // ฟังก์ชันจัดการการอัปโหลดรูปภาพ
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // จำกัดขนาดไฟล์ไม่เกิน 5MB
        setError('ขนาดไฟล์รูปภาพใหญ่เกินไป (สูงสุด 5MB)');
        return;
      }
      setImage(file); // เก็บไฟล์รูปภาพใน state
      setError(''); // ล้างข้อความข้อผิดพลาด
    }
  };

  // ฟังก์ชันเพื่อจัดการการเพิ่มสินค้าใหม่
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true); // เริ่มสถานะการโหลด

    // สร้าง FormData เพื่อจัดการกับข้อมูลและไฟล์
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('description', description);
    formData.append('price', price);
    if (image) {
      formData.append('image', image); // เพิ่มไฟล์รูปภาพใน FormData
    }

    try {
      // ส่งข้อมูลไปยัง API เพื่อเพิ่มสินค้าใหม่
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData, // ใช้ FormData เป็น body
      });

      if (response.ok) {
        alert('เพิ่มสินค้าสำเร็จ');
        fetchProducts(); // ดึงข้อมูลสินค้าใหม่อีกครั้ง
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.error || 'เกิดข้อผิดพลาดในการเพิ่มสินค้า');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('เกิดข้อผิดพลาดในการเพิ่มสินค้า');
    } finally {
      setIsLoading(false); // จบสถานะการโหลด
    }

    // เคลียร์ฟิลด์ข้อมูล
    setProductName('');
    setDescription('');
    setPrice('');
    setImage(null);
  };

  // ฟังก์ชันเพื่อดึงข้อมูลสินค้าจากฐานข้อมูล
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า');
    }
  };

  // ดึงข้อมูลสินค้าทันทีที่คอมโพเนนต์ถูกสร้าง
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">เพิ่มสินค้าใหม่</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleAddProduct} encType="multipart/form-data">
        <div className="mb-4">
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
            ชื่อสินค้า
          </label>
          <Input
            id="productName"
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="ชื่อสินค้า"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            รายละเอียด
          </label>
          <Input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="รายละเอียดสินค้า"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            ราคา
          </label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="ราคา"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            รูปภาพ
          </label>
          <Input
            id="image"
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
          />
        </div>
        <Button type="submit" disabled={isLoading}>{isLoading ? 'กำลังเพิ่มสินค้า...' : 'เพิ่มสินค้า'}</Button>
      </form>

      {/* แสดงรายการสินค้าที่ถูกเพิ่ม */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">รายการสินค้าทั้งหมด</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">รูปภาพ</th>
              <th className="py-2 px-4 border-b">ชื่อสินค้า</th>
              <th className="py-2 px-4 border-b">รายละเอียด</th>
              <th className="py-2 px-4 border-b">ราคา</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">
                    {product.image_url ? <img src={product.image_url} alt="Product" className="w-16 h-16 object-cover" /> : 'ไม่มีรูปภาพ'}
                  </td>
                  <td className="py-2 px-4 border-b">{product.title || 'ไม่มีชื่อ'}</td>
                  <td className="py-2 px-4 border-b">{product.description || 'ไม่มีรายละเอียด'}</td>
                  <td className="py-2 px-4 border-b">{product.price || 'ไม่มีราคา'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-2 px-4 border-b text-center">ไม่มีสินค้าในขณะนี้</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddProductPage;
