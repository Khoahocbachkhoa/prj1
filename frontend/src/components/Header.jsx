import { useNavigate } from "react-router-dom";
import logo from "../assets/mainLogo.svg";
import "../styles/Header.css";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logoContainer">
        <img src={logo} alt="Logo" className="logoImage" />

        <div className="brandContainer">
          <div className="brandName">
            <span className="textPurple">MyPharma</span>{" "}
            <span className="textGreen">Software Solutions</span>
          </div>
          <div className="slogan">New Technologies For Life</div>
        </div>
      </div>

      <div className="rightSection">
        <nav className="nav">
          {["Trang chủ", "Giải pháp", "Giới thiệu", "Trợ giúp", "Hỗ trợ"].map(
            (item) => (
              <a key={item} href="#" className="navLink">
                {item}
              </a>
            )
          )}
        </nav>

        <div className="buttonGroup">
          <button className="headerSignUpBtn">Đăng ký</button>
          <button
            className="headerLoginBtn"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </header>
  );
}