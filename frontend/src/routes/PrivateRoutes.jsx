import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  // ❌ Chưa login → đá về login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Đã login
  return children;
}
