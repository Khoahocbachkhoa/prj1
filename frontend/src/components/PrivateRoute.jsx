import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");

  // Nếu có token -> Cho vào (Render Outlet)
  // Nếu không -> Về trang login và yêu cầu đăng nhập
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;