import img from "../assets/homepagePic.png";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <main className={styles.heroSection}>
      <div className={styles.heroBackground}>
        <div className={styles.heroContainer}>
          <div className={styles.heroLeft}>
            <h2 className={styles.heroTitle}>Giải pháp quản lý nhà thuốc</h2>
            <h2 className={styles.heroSubtitle}>
              Đơn giản – Chính xác – Hiệu quả
            </h2>

            <p className={styles.heroDescription}>
              Với hơn 15 năm kinh nghiệm trong lĩnh vực phát triển phần mềm,
              chúng tôi mang đến những giải pháp công nghệ tiên tiến nhất để cải
              thiện cuộc sống và nâng cao hiệu quả kinh doanh.
            </p>

            <div className={styles.heroActions}>
              <button className={styles.btnPrimary}>Nhận tư vấn</button>
              <button className={styles.btnSecondary}>Tìm hiểu thêm ↓</button>
            </div>
          </div>

          <div className={styles.heroRight}>
            <img src={img} alt="Ảnh bìa" className={styles.heroImage} />
          </div>
        </div>
      </div>
    </main>
  );
}