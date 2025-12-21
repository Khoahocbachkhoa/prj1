import { FaUser, FaLock } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/authApi";
import "../styles/LoginPage.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    try {
      const res = await loginApi(username, password);
      const { role, msg } = res.data;

      // bản demo: role luôn là admin
      if (role === "admin") {
        alert(msg);
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.msg);
      } else {
        setError("Không thể kết nối tới server");
      }
    }
  };

  return (
    <div className="pageWrapper">
      <div className="loginCard">
        <h2 className="loginTitle">Đăng nhập</h2>

        <form className="form">
          {/* USERNAME */}
          <div className="inputGroup">
            <label className="inputLabel">Tên đăng nhập</label>
            <div className="inputField">
              <FaUser style={{ color: "#9ca3af", marginRight: 10 }} />
              <input
                className="input"
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="inputGroup">
            <label className="inputLabel">Mật khẩu</label>
            <div className="inputField">
              <FaLock style={{ color: "#9ca3af", marginRight: 10 }} />
              <input
                className="input"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div style={{ color: "red", fontSize: 12 }}>
              {error}
            </div>
          )}

          <button
            type="button"
            className="loginBtn"
            onClick={handleLogin}
          >
            Đăng nhập
          </button>
        </form>

        <div className="signupBox">
          Chưa có tài khoản?
          <span className="signupLink">Đăng ký</span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;