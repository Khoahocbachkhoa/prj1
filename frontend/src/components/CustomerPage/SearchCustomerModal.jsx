import { useState } from "react";
import { searchCustomerApi } from "../../api/customerApi";

import styles from "./SearchCustomerModal.module.css";

export default function SearchCustomerModal({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  if (!open) return null;

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const res = await searchCustomerApi(query);
      setResults(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Tìm kiếm khách hàng</h2>

        {/* SEARCH */}
        <div className={styles.searchBox}>
          <input
            className={styles.input}
            placeholder="Tên hoặc SĐT"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className={styles.searchBtn} onClick={handleSearch}>
            Tìm
          </button>
        </div>

        {/* RESULT TABLE */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tên</th>
              <th>SĐT</th>
              <th>Địa chỉ</th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? (
              results.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.phone || "---"}</td>
                  <td>{c.address || "---"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className={styles.empty}>
                  Không có kết quả
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ACTIONS */}
        <div className={styles.actions}>
          <button className={styles.closeBtn} onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
