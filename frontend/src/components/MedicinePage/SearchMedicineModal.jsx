import { useState } from "react";
import { searchMedicineApi } from "../../api/medicineApi";
import styles from "./SearchMedicineModal.module.css";

export default function SearchMedicineModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await searchMedicineApi(searchQuery);
      setSearchResults(res.data);
    } catch (error) {
      alert("Lỗi tìm kiếm: " + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${styles.large}`}>
        <h2 className={styles.modalTitle}>Tra cứu thông tin thuốc</h2>
        <div className={styles.searchBox}>
          <input 
            className={styles.formInput}
            placeholder="Nhập tên thuốc..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            style={{ flex: 1 }}
          />
          <button onClick={handleSearch} className={`${styles.btn} ${styles["btn-primary"]}`}>Tìm</button>
        </div>

        {/* Bảng kết quả tìm kiếm */}
        <table className={styles.medicineTable}>
          <thead>
            <tr><th>Tên thuốc</th><th>Hãng</th><th>Đơn vị</th><th>Giá bán</th><th>Tồn kho</th></tr>
          </thead>
          <tbody>
            {searchResults.length > 0 ? searchResults.map(med => (
              <tr key={med.id}>
                <td>{med.name}</td>
                <td>{med.brand}</td>
                <td>{med.unit}</td>
                <td>{med.price.toLocaleString()}₫</td>
                <td className={med.quantity > 0 ? styles["text-success"] : styles["text-danger"]}>
                  {med.quantity}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className={styles["no-data"]}>Không có kết quả</td>
              </tr>
            )}
          </tbody>
        </table>
        
        <button 
          onClick={onClose} 
          className={`${styles.btn} ${styles["btn-secondary"]}`} 
          style={{ marginTop: "20px", float: "right" }}
        >
          Đóng
        </button>
      </div>
    </div>
  );
}