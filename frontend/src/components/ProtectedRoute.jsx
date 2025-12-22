import { Navigate } from 'react-router-dom';

// Component này nhận vào children (chính là Dashboard)
const ProtectedRoute = ({ children }) => {
  // 1. Lấy token từ localStorage (hoặc từ Redux/Context nếu bạn dùng)
  const token = localStorage.getItem('token'); 

  // 2. Kiểm tra logic
  if (!token) {
    // Nếu không có token, chuyển hướng về trang login
    // 'replace' giúp user không back lại được trang này bằng nút Back của trình duyệt
    return <Navigate to="/login"/>;
  }

  // 3. Nếu có token, render component con (Dashboard)
  return children;
};

export default ProtectedRoute;