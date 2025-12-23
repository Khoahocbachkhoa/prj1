import { useState, useEffect, useCallback } from "react";
import { getCustomersApi, addCustomerApi, searchCustomerApi } from "../../../api/customerApi";

// 1. Đổi import sang CSS Modules
import styles from "../../styles/CustomerPage.module.css";

export default function CustomerPage() {
  // --- STATE QUẢN LÝ ---
  const [customers, setCustomers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);
  
  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // State form và tìm kiếm
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // --- 1. HÀM LOAD DỮ LIỆU ---
  const loadCustomers = useCallback(async () => {
    try {
      const res = await getCustomersApi();
      setCustomers(res.data);
    } catch (error) {
      console.error("Lỗi tải danh sách khách hàng:", error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCustomers();
  }, [loadCustomers]);

  // --- 2. XỬ LÝ THÊM KHÁCH HÀNG ---
  const handleAddCustomer = async () => {
    if (!formData.name) return alert("Vui lòng nhập tên khách hàng!");
    
    try {
      await addCustomerApi(formData);
      alert("Thêm khách hàng thành công!");
      setShowAddForm(false);
      setFormData({ name: "", phone: "", address: "" });
      loadCustomers(); // Reload lại bảng
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.msg || error.message));
    }
  };

  // --- 3. XỬ LÝ TÌM KIẾM ---
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await searchCustomerApi(searchQuery);
      setSearchResults(res.data);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    }
  };

  // --- LOGIC PHÂN TRANG ---
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = customers.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(customers.length / rowsPerPage);

  return (
    // Sử dụng styles.className
    <div className={styles.medicineContainer}>
      <h1 className={styles.pageTitle}>Quản lý Khách hàng</h1>

      {/* THANH CHỨC NĂNG */}
      <div className={styles.actionBar}>
        <button 
          onClick={() => setShowAddForm(true)} 
          className={`${styles.btn} ${styles["btn-primary"]}`}
        >
          + Thêm khách hàng
        </button>
        <button 
          onClick={() => setShowSearchForm(true)} 
          className={`${styles.btn} ${styles["btn-secondary"]}`}
        >
          🔍 Tìm kiếm khách hàng
        </button>
      </div>

      {/* --- MODAL THÊM KHÁCH HÀNG --- */}
      {showAddForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Thêm Khách Hàng</h2>
            <div className={styles.formGroup}>
              <input 
                className={styles.formInput} 
                placeholder="Tên khách hàng (*)" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
              />
              <input 
                className={styles.formInput} 
                placeholder="Số điện thoại" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              />
              <textarea 
                className={styles.formTextarea} 
                placeholder="Địa chỉ" 
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})} 
              />
            </div>
            <div className={styles.modalActions}>
              <button 
                onClick={() => setShowAddForm(false)} 
                className={`${styles.btn} ${styles["btn-secondary"]}`}
              >
                Hủy
              </button>
              <button 
                onClick={handleAddCustomer} 
                className={`${styles.btn} ${styles["btn-success"]}`}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL TÌM KIẾM --- */}
      {showSearchForm && (
        <div className={styles.modalOverlay}>
          {/* Kết hợp nhiều class */}
          <div className={`${styles.modalContent} ${styles.large}`}>
            <h2 className={styles.modalTitle}>Tìm kiếm khách hàng</h2>
            <div className={styles.searchBox}>
              <input 
                className={styles.formInput} 
                placeholder="Nhập tên hoặc số điện thoại..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1 }}
              />
              <button 
                onClick={handleSearch} 
                className={`${styles.btn} ${styles["btn-primary"]}`}
              >
                Tìm
              </button>
            </div>
            
            <table className={styles.medicineTable}>
              <thead>
                <tr><th>Tên khách hàng</th><th>SĐT</th><th>Địa chỉ</th></tr>
              </thead>
              <tbody>
                {searchResults.length > 0 ? searchResults.map(c => (
                  <tr key={c.id}>
                    <td style={{fontWeight: 500}}>{c.name}</td>
                    <td>{c.phone}</td>
                    <td>{c.address}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className={styles["no-data"]}>
                      Không có kết quả
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className={styles.modalActions}>
              <button 
                onClick={() => setShowSearchForm(false)} 
                className={`${styles.btn} ${styles["btn-secondary"]}`}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- BẢNG DANH SÁCH CHÍNH --- */}
      <div className={styles.tableControls}>
        <label>Hiển thị:</label>
        <select 
          className={styles.tableSelect} 
          value={rowsPerPage} 
          onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
        >
          <option value={5}>5 dòng</option>
          <option value={10}>10 dòng</option>
          <option value={20}>20 dòng</option>
        </select>
      </div>

      <table className={styles.medicineTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên khách hàng</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.length > 0 ? currentRows.map((cus) => (
            <tr key={cus.id}>
              <td>#{cus.id}</td>
              <td style={{fontWeight: "600", color: "#2563eb"}}>{cus.name}</td>
              <td>{cus.phone || "---"}</td>
              <td style={{color: "#64748b"}}>{cus.address || "---"}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="4" className={styles["no-data"]}>
                Chưa có khách hàng nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PHÂN TRANG */}
      <div className={styles.paginationFooter}>
        <div className={styles.paginationControls}>
          <button 
            className={styles.paginationBtn} 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Trang {currentPage} / {totalPages || 1}</span>
          <button 
            className={styles.paginationBtn} 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
}