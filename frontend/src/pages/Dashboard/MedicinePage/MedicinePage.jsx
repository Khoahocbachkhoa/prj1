/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import { getMedicineOptionsApi, getSupplierOptionsApi, getImportHistoryApi } from "../../../api/medicineApi";
import styles from "./MedicinePage.module.css";

import ImportReceiptModal from "../../../components/MedicinePage/ImportReceiptModal";
import AddMedicineModal from "../../../components/MedicinePage/AddMedicineModal";
import SearchMedicineModal from "../../../components/MedicinePage/SearchMedicineModal";
import MedicineTable from "../../../components/MedicinePage/MedicineTable";

export default function MedicinePage() {
  // quản lý các form
  const [modals, setModals] = useState({
    import: false,
    search: false,
    add: false
  });

  // quản lý dữ liệu dùng chung
  const [data, setData] = useState({
    history: [],      // Lịch sử nhập kho
    medOptions: [],   // Danh sách thuốc cho dropdown
    supOptions: []    // Danh sách NCC cho dropdown
  });

  // Quản lý số dòng tối đa hiển thị trên bảng
  const [pagination, setPagination] = useState({ page: 1, limit: 5 });

  // Lấy danh sách các nhà cung cấp và các loại thuốc
  const fetchOptions = useCallback(async () => {
    try {
      const [medRes, supRes] = await Promise.all([
        getMedicineOptionsApi(),
        getSupplierOptionsApi()
      ]);
      setData(prev => ({ ...prev, medOptions: medRes.data, supOptions: supRes.data }));
    } catch (error) {
      console.error("Lỗi tải options:", error);
    }
  }, []);

  // Lấy lịch sử nhập thuốc
  const loadImportHistory = useCallback(async (month = null, year = null) => {
    try {
      const res = await getImportHistoryApi(month, year);
      setData(prev => ({ ...prev, history: res.data }));
    } catch (error) {
      console.error("Lỗi tải lịch sử:", error);
    }
  }, []);

  // Load dữ liệu lần đầu khi tải trang
  useEffect(() => {
    fetchOptions();
    loadImportHistory();
  }, [fetchOptions, loadImportHistory]);

  // Xử lý mở đóng một form
  const toggleModal = (modalName, isOpen) => {
    setModals(prev => ({ ...prev, [modalName]: isOpen }));
  };

  // Load lại dữ liệu khi người dùng có thao tác
  const refreshData = () => {
    loadImportHistory();
    fetchOptions();      
  };

  // Lọc lịch sử nhập theo tháng
  const handleFilterThisMonth = () => {
    const today = new Date();
    loadImportHistory(today.getMonth() + 1, today.getFullYear());
    setPagination(prev => ({ ...prev, page: 1 }));
    alert(`Đã lọc danh sách tháng ${today.getMonth() + 1}/${today.getFullYear()}`);
  };

  // Xử lý phân trang
  const indexOfLastRow = pagination.page * pagination.limit;
  const indexOfFirstRow = indexOfLastRow - pagination.limit;
  const currentRows = data.history.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.history.length / pagination.limit);

  return (
    <div className={styles.medicineContainer}>
      <h1 className={styles.pageTitle}>Quản lý kho</h1>

      {/* THANH CÔNG CỤ */}
      <div className={styles.actionBar}>
        <button 
          onClick={() => toggleModal('import', true)} 
          className={`${styles.btn} ${styles["btn-primary"]}`}
        >
          + Nhập kho thuốc
        </button>

        <div className={styles.actionGroup}>
          <button 
            onClick={() => toggleModal('search', true)} 
            className={`${styles.btn} ${styles["btn-secondary"]}`}
          >
            🔍 Tìm kiếm thuốc
          </button>
          <button 
            onClick={() => toggleModal('add', true)} 
            className={`${styles.btn} ${styles["btn-success"]}`}
          >
            + Thêm loại thuốc mới
          </button>
        </div>
      </div>

      {/* Điều khiển hiển thị trên bảng */}
      <div className={styles.tableControls}>
        <label>Hiển thị:</label>
        <select 
          className={styles.tableSelect} 
          value={pagination.limit} 
          onChange={(e) => setPagination({ page: 1, limit: Number(e.target.value) })}
        >
          <option value={5}>5 dòng</option>
          <option value={10}>10 dòng</option>
        </select>
      </div>

      {/* Bảng dữ liệu */}
      <MedicineTable data={currentRows} />

      {/* Nút phân trang */}
      <div className={styles.paginationFooter}>
        <div className={styles.paginationControls}>
          <button 
            className={styles.paginationBtn} 
            onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))} 
            disabled={pagination.page === 1}
          >
            Previous
          </button>
          <span>Trang {pagination.page}/{totalPages || 1}</span>
          <button 
            className={styles.paginationBtn} 
            onClick={() => setPagination(p => ({ ...p, page: Math.min(totalPages, p.page + 1) }))} 
            disabled={pagination.page >= totalPages}
          >
            Next
          </button>
        </div>
        <button 
          onClick={handleFilterThisMonth} 
          className={`${styles.btn} ${styles["btn-info"]}`}
        >
          Hiện danh sách nhập tháng này
        </button>
      </div>

      {/* Các form nhập khóa đơn, thêm loại thuốc, tìm kiếm thuốc */}
      <ImportReceiptModal 
        isOpen={modals.import}
        onClose={() => toggleModal('import', false)}
        onSuccess={refreshData}
        medicineOptions={data.medOptions}
        supplierOptions={data.supOptions}
      />

      <AddMedicineModal
        isOpen={modals.add}
        onClose={() => toggleModal('add', false)}
        onSuccess={refreshData}
        supplierOptions={data.supOptions}
      />

      <SearchMedicineModal
        isOpen={modals.search}
        onClose={() => toggleModal('search', false)}
      />
    </div>
  );
}