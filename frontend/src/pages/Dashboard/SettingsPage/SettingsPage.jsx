// Phiên bản 1 : Setting page chỉ có mỗi cái nút đăng xuất đơn giản!!!

import styles from "./SettingsPage.module.css";

export default function SettingsPage() {
  const handleLogout = () => {
    // Xóa token và điều hướng về login
    localStorage.removeItem("token"); 
    window.location.href = "/login";
  };

  return (
    <div className={styles.container}>
      <h2>Cài đặt</h2>

      <button className={styles.logoutBtn} onClick={handleLogout}>
        Đăng xuất
      </button>
    </div>
  );
}
