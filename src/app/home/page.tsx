// นำเข้าเฉพาะคอมโพเนนต์ที่จำเป็น ไม่ต้องนำเข้า Header ซ้ำ
import Content from "../components/Content";
import Footer from "../components/Footer";
import PaginationPage from "../components/Pagination";

const HomePage = () => {
  return (
    <div>
      <Content />
      <PaginationPage />
    </div>
  );
};

export default HomePage;
