/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "res.cloudinary.com"], // ✅ เพิ่ม Cloudinary เข้าไป
  },
};

export default nextConfig;
