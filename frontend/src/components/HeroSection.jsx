import img from "../assets/homepagePic.png";
import "../styles/HeroSection.css";

export default function HeroSection() {
  return (
    <main className="heroSection">
      <div className="heroBackground">
        <div className="heroContainer">
          <div className="heroLeft">
            <h2 className="heroTitle">Giải pháp quản lý nhà thuốc</h2>
            <h2 className="heroSubtitle">
              Đơn giản – Chính xác – Hiệu quả
            </h2>

            <p className="heroDescription">
              Với hơn 15 năm kinh nghiệm trong lĩnh vực phát triển phần mềm,
              chúng tôi mang đến những giải pháp công nghệ tiên tiến nhất để cải
              thiện cuộc sống và nâng cao hiệu quả kinh doanh.
            </p>

            <div className="heroActions">
              <button className="btnPrimary">Nhận tư vấn</button>
              <button className="btnSecondary">Tìm hiểu thêm ↓</button>
            </div>
          </div>

          <div className="heroRight">
            <img src={img} alt="Ảnh bìa" className="heroImage" />
          </div>
        </div>
      </div>
    </main>
  );
}
