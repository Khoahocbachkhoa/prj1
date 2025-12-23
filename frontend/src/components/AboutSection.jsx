import styles from "../styles/AboutSection.module.css"; 

export default function AboutSection() {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.aboutContainer}>
        <div className={styles.aboutHeader}>
          <h2 className={styles.aboutMainTitle}>Về Chúng Tôi</h2>
          <div className={styles.titleUnderline}></div>
          <p className={styles.aboutMainDesc}>
            MyPharma App được thiết kế với hy vọng cung cấp một công cụ đắc lực
            trong quản lý và vận hành tiệm thuốc.
          </p>
        </div>

        <div className={styles.aboutContent}>
          <div className={styles.aboutLeft}>
            <h3 className={styles.sectionTitle}>Hành trình phát triển</h3>
            <p className={styles.sectionDesc}>
              Từ những ngày đầu, phần mềm đã được không ngừng đổi mới và phát
              triển, luôn đặt chất lượng và sự hài lòng của khách hàng lên hàng
              đầu.
            </p>

            <ul className={styles.featureList}>
              {[
                "Đội ngũ chuyên gia có trình độ cao",
                "Công nghệ tiên tiến và hiện đại",
                "Giao diện thân thiện và dễ sử dụng",
                "Công cụ quản lý đầy mạnh mẽ",
              ].map((text, index) => (
                <li key={index} className={styles.featureItem}>
                  <span className={styles.bulletPoint}>•</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.aboutRightBox}>
            <div className={styles.visionItem}>
              <h4 className={styles.visionLabel}>Tầm nhìn</h4>
              <p className={styles.visionText}>
                Trở thành phần mềm có mặt tại mọi đại lý thuốc.
              </p>
            </div>

            <div className={styles.visionItem}>
              <h4 className={styles.visionLabel}>Nhiệm vụ</h4>
              <p className={styles.visionText}>
                Cung cấp các giải pháp phần mềm chất lượng cao.
              </p>
            </div>

            <div className={styles.visionItem}>
              <h4 className={styles.visionLabel}>Cam kết</h4>
              <p className={styles.visionText}>
                Cam kết mang đến giải pháp tối ưu nhất.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}