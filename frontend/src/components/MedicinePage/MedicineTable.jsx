import styles from "./MedicineTable.module.css";

export default function MedicineTable({ data }) {
  return (
    <table className={styles.medicineTable}>
      <thead>
        <tr>
          <th>Ngày nhập</th>
          <th>Thuốc nhập</th>
          <th>Hãng</th>
          <th>Số lượng</th>
          <th>Giá nhập</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? data.map(med => (
          <tr key={med.id}>
            <td>{med.date}</td>
            <td>{med.name}</td>
            <td>{med.brand}</td>
            <td className={styles["text-center"]}>{med.qty}</td>
            <td>{med.price.toLocaleString('vi-VN')}₫</td>
          </tr>
        )) : (
          <tr>
            <td colSpan="5" className={styles["no-data"]}>Chưa có dữ liệu</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}