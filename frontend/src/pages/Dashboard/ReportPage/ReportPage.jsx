import { useEffect, useState } from "react";
// Đảm bảo đường dẫn import API đúng với cấu trúc dự án của bạn
import {
  getSaleByMonth,
  getNumInvoiceByMonth,
  getTopCustomer,
  getReportMedicines,
} from "../../../api/reportApi";

import styles from "./ReportPage.module.css";

/* ===== FAKE DATA: DOANH THU 12 THÁNG (triệu VND) ===== */
const FAKE_MONTHLY_SALES = [
  120, 150, 180, 160, 210, 250, 300, 280, 240, 220, 200, 320,
];

const FAKE_MONTHLY_IMPORTS = [
  80, 100, 130, 110, 150, 180, 210, 200, 170, 160, 140, 230,
];

export default function ReportPage() {
  const [totalSales, setTotalSales] = useState(0);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [topCustomers, setTopCustomers] = useState([]);
  const [bestMedicines, setBestMedicines] = useState([]);
  const [slowMedicines, setSlowMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch dữ liệu
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const [saleRes, invoiceRes, customerRes, medicineRes] =
          await Promise.all([
            getSaleByMonth(),
            getNumInvoiceByMonth(),
            getTopCustomer(),
            getReportMedicines(),
          ]);

        setTotalSales(saleRes.data.total_sales || 0);
        setInvoiceCount(invoiceRes.data.total_invoices || 0);
        setTopCustomers(customerRes.data || []);
        setBestMedicines(medicineRes.data.best_sellers || []);
        setSlowMedicines(medicineRes.data.slow_sellers || []);
      } catch (err) {
        console.error("Lỗi tải báo cáo", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  if (loading) {
    return <p className={styles.loading}>Đang tải dữ liệu báo cáo...</p>;
  }

  const maxValue = Math.max(...FAKE_MONTHLY_SALES, ...FAKE_MONTHLY_IMPORTS);

  const chartData = FAKE_MONTHLY_SALES.map((sale, i) => ({
    sale,
    import: FAKE_MONTHLY_IMPORTS[i],
    salePercent: Math.round((sale / maxValue) * 100),
    importPercent: Math.round((FAKE_MONTHLY_IMPORTS[i] / maxValue) * 100),
  }));

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Thống kê tổng quan</h1>

      {/* ====== THẺ TỔNG QUAN ====== */}
      <div className={styles.cardGrid}>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Doanh thu tháng này</p>
          <h2 className={styles.cardValue}>
            {totalSales.toLocaleString("vi-VN")} ₫
          </h2>
        </div>

        <div className={styles.card}>
          <p className={styles.cardLabel}>Số hóa đơn tháng này</p>
          <h2 className={styles.cardValue}>{invoiceCount}</h2>
        </div>
      </div>

      <div className={styles.chartCard}>
        <h3>Doanh thu & Giá nhập theo tháng (Triệu VNĐ)</h3>

        <div className={styles.simpleChart}>
          {chartData.map((item, i) => (
            <div key={i} className={styles.colWrapper}>
              <div className={styles.barGroup}>
                {/* Cột giá nhập (xám) */}
                <div
                  className={`${styles.bar} ${styles.importBar}`}
                  style={{ height: `${item.importPercent}%` }}
                  title={`Giá nhập: ${item.import} triệu`}
                />

                {/* Cột doanh thu (xanh) */}
                <div
                  className={`${styles.bar} ${styles.saleBar}`}
                  style={{ height: `${item.salePercent}%` }}
                  title={`Doanh thu: ${item.sale} triệu`}
                />
              </div>

              <span className={styles.barLabel}>T{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ====== KHÁCH & THUỐC ====== */}
      <div className={styles.bottomGrid}>
        {/* Bảng Top Khách hàng */}
        <div className={styles.tableCard}>
          <h3>Khách mua nhiều nhất</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Tên khách</th>
                <th className={`${styles.th} ${styles.right}`}>Tổng mua</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((c, i) => (
                <tr key={i}>
                  <td className={styles.td}>{c.name}</td>
                  <td className={`${styles.td} ${styles.money}`}>
                    {c.total.toLocaleString("vi-VN")} ₫
                  </td>
                </tr>
              ))}
              {topCustomers.length === 0 && (
                <tr>
                  <td colSpan="2" className={styles.td}>
                    Chưa có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Danh sách Thuốc */}
        <div className={styles.tableCard}>
          <h3>Thuốc bán chạy</h3>
          <ul className={styles.list}>
            {bestMedicines.map((m, i) => (
              <li key={i} className={styles.goodItem}>
                {m.name} <strong>({m.quantity})</strong>
              </li>
            ))}
            {bestMedicines.length === 0 && <li>Chưa có dữ liệu</li>}
          </ul>

          <h3 className={styles.subTitle}>Thuốc bán chậm</h3>
          <ul className={styles.list}>
            {slowMedicines.map((m, i) => (
              <li key={i} className={styles.badItem}>
                {m.name} <strong>({m.quantity})</strong>
              </li>
            ))}
            {slowMedicines.length === 0 && <li>Chưa có dữ liệu</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
