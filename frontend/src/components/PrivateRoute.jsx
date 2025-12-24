import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  // Không có token thì bắt quay lại login
  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;