import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaPills,
  FaFileInvoiceDollar,
  FaUsers,
  FaCog,
} from "react-icons/fa";

import MedicinePage from "./Dashboard/MedicinePage";
import InvoicePage from "./Dashboard/InvoicePage";
import CustomerPage from "./Dashboard/CustomerPage";
import ReportPage from "./Dashboard/ReportPage";
import SettingsPage from "./Dashboard/SettingsPage";

import styles from "../styles/Dashboard.module.css";

export default function Dashboard() {
  const location = useLocation();

  const menuItems = [
    { name: "Thống kê", path: "/dashboard/home", icon: <FaHome /> },
    { name: "Kho thuốc", path: "/dashboard/medicine", icon: <FaPills /> },
    { name: "Hóa đơn", path: "/dashboard/invoice", icon: <FaFileInvoiceDollar /> },
    { name: "Khách hàng", path: "/dashboard/customer", icon: <FaUsers /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <div className={styles["sidebar-header"]}>DASHBOARD</div>

        <nav className={styles.menu}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles["menu-item"]} ${
                isActive(item.path) ? styles.active : ""
              }`}
            >
              <span className={styles.icon}>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className={styles["sidebar-footer"]}>
          <Link
            to="/dashboard/settings"
            className={`${styles["menu-item"]} ${
              isActive("/dashboard/settings") ? styles.active : ""
            }`}
          >
            <span className={styles.icon}>
              <FaCog />
            </span>
            Cài đặt
          </Link>
        </div>
      </aside>

      <main className={styles.content}>
        <Routes>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<ReportPage />} />
          <Route path="medicine" element={<MedicinePage />} />
          <Route path="invoice" element={<InvoicePage />} />
          <Route path="customer" element={<CustomerPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}