import { useNavigate } from "react-router-dom";
import logo from "../assets/mainLogo.svg";
import styles from "../styles/Header.module.css"; 

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="Logo" className={styles.logoImage} />

        <div className={styles.brandContainer}>
          <div className={styles.brandName}>
            <span className={styles.textPurple}>MyPharma</span>{" "}
            <span className={styles.textGreen}>Software Solutions</span>
          </div>
          <div className={styles.slogan}>New Technologies For Life</div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <nav className={styles.nav}>
          {["Trang chủ", "Giải pháp", "Giới thiệu", "Trợ giúp", "Hỗ trợ"].map(
            (item) => (
              <a key={item} href="#" className={styles.navLink}>
                {item}
              </a>
            )
          )}
        </nav>

        <div className={styles.buttonGroup}>
          <button className={styles.headerSignUpBtn}>Đăng ký</button>
          <button
            className={styles.headerLoginBtn}
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </header>
  );
}