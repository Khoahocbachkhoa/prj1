import { useState, useEffect, useCallback } from "react";
// Import file API và CSS đã tách
import { 
  getMedicineOptionsApi, 
  getSupplierOptionsApi, 
  getImportHistoryApi, 
  searchMedicineApi, 
  addMedicineApi, 
  createImportReceiptApi 
} from "../../api/medicineApi.js";
import "../../styles/MedicinePage.css";

export default function MedicinePage() {
  // --- STATE HIỂN THỊ POPUP ---
  const [showImportForm, setShowImportForm] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [showAddMedForm, setShowAddMedForm] = useState(false);

  // --- STATE DỮ LIỆU ---
  const [medicines, setMedicines] = useState([]); 
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [supplierOptions, setSupplierOptions] = useState([]);

  // --- STATE PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // --- STATE TÌM KIẾM & FORM ---
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [newMedData, setNewMedData] = useState({ name: "", category: "", unit: "", price: "", supplierId: "", description: "" });
  const [formData, setFormData] = useState({ medicineId: "", supplierId: "", qty: "", price: "" });


  // =================================================================================
  // 1. CÁC HÀM GỌI API (Đã thay bằng function từ file api/medicineApi.js)
  // =================================================================================
  
  const fetchOptions = useCallback(async () => {
    try {
      const medRes = await getMedicineOptionsApi();
      setMedicineOptions(medRes.data);
      
      const supRes = await getSupplierOptionsApi();
      setSupplierOptions(supRes.data);
    } catch (error) {
      console.error("Lỗi tải options:", error);
    }
  }, []);

  const loadImportHistory = useCallback(async (month = null, year = null) => {
    try {
      const res = await getImportHistoryApi(month, year);
      setMedicines(res.data);
    } catch (error) {
      console.error("Lỗi tải lịch sử:", error);
    }
  }, []);

  // =================================================================================
  // 2. USE EFFECT
  // =================================================================================
  useEffect(() => {
    fetchOptions();
    loadImportHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 


  // =================================================================================
  // 3. HANDLERS
  // =================================================================================

  // --- Tìm kiếm thuốc ---
  const handleSearchMedicine = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await searchMedicineApi(searchQuery);
      setSearchResults(res.data);
    } catch (error) {
      alert("Lỗi tìm kiếm: " + error.message);
    }
  };

  // --- Thêm thuốc mới ---
  const handleAddNewMedicine = async () => {
    if (!newMedData.name || !newMedData.price || !newMedData.supplierId) {
      return alert("Tên, Giá và Nhà cung cấp là bắt buộc!");
    }
    try {
      const payload = {
        name: newMedData.name,
        category: newMedData.category,
        unit: newMedData.unit,
        price: newMedData.price,
        supplier_id: newMedData.supplierId,
        description: newMedData.description
      };
      
      await addMedicineApi(payload);
      alert("Thêm thuốc mới thành công!");
      
      setShowAddMedForm(false);
      setNewMedData({ name: "", category: "", unit: "", price: "", supplierId: "", description: "" });
      fetchOptions(); 
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.msg || error.message));
    }
  };

  // --- Lọc tháng này ---
  const handleFilterThisMonth = () => {
    const today = new Date();
    loadImportHistory(today.getMonth() + 1, today.getFullYear());
    alert(`Đã lọc danh sách tháng ${today.getMonth() + 1}/${today.getFullYear()}`);
    setCurrentPage(1); 
  };

  // --- Xử lý Form nhập kho ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "medicineId") {
      const selectedMed = medicineOptions.find(m => m.id === Number(value));
      setFormData({ ...formData, [name]: value, price: selectedMed ? selectedMed.price : formData.price });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSaveImport = async () => {
    if (!formData.medicineId || !formData.supplierId || !formData.qty || !formData.price) {
      return alert("Vui lòng nhập đầy đủ thông tin!");
    }
    try {
      const payload = {
        supplier_id: formData.supplierId,
        medicine_id: formData.medicineId,
        quantity: formData.qty,
        price: formData.price
      };

      await createImportReceiptApi(payload);
      alert("Nhập kho thành công!");
      setShowImportForm(false);
      setFormData({ medicineId: "", supplierId: "", qty: "", price: "" });
      loadImportHistory(); 
      setCurrentPage(1); 
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.msg || "Hệ thống lỗi"));
    }
  };

  // --- Logic Phân trang ---
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = medicines.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(medicines.length / rowsPerPage);


  // =================================================================================
  // 4. GIAO DIỆN (JSX - Sử dụng ClassName thay vì Inline Style)
  // =================================================================================
  return (
    <div className="medicineContainer">
      <h1 className="pageTitle">Quản lý kho</h1>

      {/* THANH CHỨC NĂNG */}
      <div className="actionBar">
        <button onClick={() => setShowImportForm(true)} className="btn btn-primary">
          + Nhập kho thuốc
        </button>

        <div className="actionGroup">
          <button onClick={() => setShowSearchForm(true)} className="btn btn-secondary">🔍 Tìm kiếm thuốc</button>
          <button onClick={() => setShowAddMedForm(true)} className="btn btn-success">
            + Thêm loại thuốc mới
          </button>
        </div>
      </div>

      {/* --- MODAL TÌM KIẾM --- */}
      {showSearchForm && (
        <div className="modalOverlay">
          <div className="modalContent large">
            <h2 className="modalTitle">Tra cứu thông tin thuốc</h2>
            <div className="searchBox">
              <input 
                className="formInput"
                placeholder="Nhập tên thuốc..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                style={{ flex: 1 }}
              />
              <button onClick={handleSearchMedicine} className="btn btn-primary">Tìm</button>
            </div>
            <table className="medicineTable">
              <thead>
                <tr><th>Tên thuốc</th><th>Hãng</th><th>Đơn vị</th><th>Giá bán</th><th>Tồn kho</th></tr>
              </thead>
              <tbody>
                {searchResults.length > 0 ? searchResults.map(med => (
                  <tr key={med.id}>
                    <td>{med.name}</td><td>{med.brand}</td><td>{med.unit}</td><td>{med.price.toLocaleString()}₫</td>
                    <td className={med.quantity > 0 ? "text-success" : "text-danger"}>{med.quantity}</td>
                  </tr>
                )) : <tr><td colSpan="5" className="no-data">Không có kết quả</td></tr>}
              </tbody>
            </table>
            <button onClick={() => setShowSearchForm(false)} className="btn btn-secondary" style={{ marginTop: "20px", float: "right" }}>Đóng</button>
          </div>
        </div>
      )}

      {/* --- MODAL THÊM THUỐC --- */}
      {showAddMedForm && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2 className="modalTitle">Thêm thuốc mới</h2>
            <div className="formGroup">
              <input className="formInput" placeholder="Tên thuốc (*)" value={newMedData.name} onChange={(e) => setNewMedData({...newMedData, name: e.target.value})} />
              <input className="formInput" placeholder="Danh mục" value={newMedData.category} onChange={(e) => setNewMedData({...newMedData, category: e.target.value})} />
              <input className="formInput" placeholder="Đơn vị tính" value={newMedData.unit} onChange={(e) => setNewMedData({...newMedData, unit: e.target.value})} />
              <input className="formInput" type="number" placeholder="Giá bán (*)" value={newMedData.price} onChange={(e) => setNewMedData({...newMedData, price: e.target.value})} />
              <select className="formSelect" value={newMedData.supplierId} onChange={(e) => setNewMedData({...newMedData, supplierId: e.target.value})}>
                <option value="">-- Chọn Nhà Cung Cấp (*) --</option>
                {supplierOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <textarea className="formTextarea" placeholder="Mô tả..." value={newMedData.description} onChange={(e) => setNewMedData({...newMedData, description: e.target.value})} />
            </div>
            <div className="modalActions">
              <button onClick={() => setShowAddMedForm(false)} className="btn btn-secondary">Hủy</button>
              <button onClick={handleAddNewMedicine} className="btn btn-success">Lưu</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL NHẬP KHO --- */}
      {showImportForm && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2 className="modalTitle">Phiếu Nhập Kho</h2>
            <div className="formGroup">
              <select className="formSelect" name="medicineId" value={formData.medicineId} onChange={handleInputChange}>
                <option value="">-- Chọn thuốc --</option>
                {medicineOptions.map(m => <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>)}
              </select>
              <select className="formSelect" name="supplierId" value={formData.supplierId} onChange={handleInputChange}>
                <option value="">-- Chọn NCC --</option>
                {supplierOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <input className="formInput" name="qty" type="number" placeholder="Số lượng" value={formData.qty} onChange={handleInputChange} />
              <input className="formInput" name="price" type="number" placeholder="Giá nhập" value={formData.price} onChange={handleInputChange} />
            </div>
            <div className="modalActions">
              <button onClick={() => setShowImportForm(false)} className="btn btn-secondary">Hủy</button>
              <button onClick={handleSaveImport} className="btn btn-success">Lưu phiếu</button>
            </div>
          </div>
        </div>
      )}

      {/* --- BẢNG VÀ PHÂN TRANG --- */}
      <div className="tableControls">
        <label>Hiển thị:</label>
        <select className="tableSelect" value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
          <option value={5}>5 dòng</option>
          <option value={10}>10 dòng</option>
        </select>
      </div>

      <table className="medicineTable">
        <thead>
          <tr>
            <th>Ngày nhập</th><th>Thuốc nhập</th><th>Hãng</th><th>Số lượng</th><th>Giá nhập</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.length > 0 ? currentRows.map(med => (
            <tr key={med.id}>
              <td>{med.date}</td><td>{med.name}</td><td>{med.brand}</td><td className="text-center">{med.qty}</td><td>{med.price.toLocaleString('vi-VN')}₫</td>
            </tr>
          )) : <tr><td colSpan="5" className="no-data">Chưa có dữ liệu</td></tr>}
        </tbody>
      </table>

      <div className="paginationFooter">
        <div className="paginationControls">
          <button className="paginationBtn" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}>Previous</button>
          <span>Trang {currentPage}/{totalPages || 1}</span>
          <button className="paginationBtn" onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage >= totalPages}>Next</button>
        </div>
        <button onClick={handleFilterThisMonth} className="btn btn-info">Hiện danh sách nhập tháng này</button>
      </div>
    </div>
  );
}