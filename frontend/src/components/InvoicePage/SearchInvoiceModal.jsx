import styles from "./SearchInvoiceModal.module.css";

export default function SearchInvoiceModal({
  searchQuery,
  setSearchQuery,
  onSearch,
  onClose,
}) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Tìm hóa đơn</h2>

        <div className={styles.searchBox}>
          <input
            className={styles.formInput}
            placeholder="Mã HĐ / tên KH"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button
            onClick={onSearch}
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            Tìm
          </button>
        </div>

        <div className={styles.modalActions}>
          <button
            onClick={onClose}
            className={`${styles.btn} ${styles.btnSecondary}`}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}