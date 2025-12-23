import { Navigate } from "react-router-dom";

// Chặn truy cập dashboard khi chưa đăng nhập
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Nếu có token -> Cho vào (Render Outlet)
  // Nếu không -> Về trang login và yêu cầu đăng nhập
  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;