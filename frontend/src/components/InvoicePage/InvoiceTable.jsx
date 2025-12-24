import styles from "./InvoiceTable.module.css";

export default function InvoiceTable({ invoices }) {
  return (
    <table className={styles.medicineTable}>
      <thead>
        <tr>
          <th>Mã HĐ</th>
          <th>Ngày</th>
          <th>Khách</th>
          <th className={styles.textRight}>Tổng</th>
        </tr>
      </thead>

      <tbody>
        {invoices.length ? (
          invoices.map(inv => (
            <tr key={inv.id}>
              <td className={styles.bold}>#{inv.id}</td>
              <td>{inv.date}</td>
              <td>{inv.customer_name || "--"}</td>
              <td className={`${styles.textRight} ${styles.textPrimary}`}>
                {inv.total?.toLocaleString("vi-VN")}₫
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className={styles.noData}>
              Không có dữ liệu
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}