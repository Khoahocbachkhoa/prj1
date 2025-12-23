import { useState, useEffect, useCallback } from "react";
import { getInvoicesApi, createInvoiceApi } from "../../api/invoiceApi";
import { getMedicineOptionsApi } from "../../api/medicineApi"; 
import { getCustomersApi } from "../../api/customerApi"; 

// 1. Đổi import sang CSS Modules
import styles from "../../styles/InvoicePage.module.css";

export default function InvoicePage() {
  // --- STATE ---
  const [invoices, setInvoices] = useState([]);
  const [filterType, setFilterType] = useState("all"); // all, today, week, month
  const [searchQuery, setSearchQuery] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);

  // Options cho Dropdown
  const [medOptions, setMedOptions] = useState([]);
  const [cusOptions, setCusOptions] = useState([]);

  // Form Data cho Tạo hóa đơn (Chi tiết phức tạp)
  const [selectedCustomer, setSelectedCustomer] = useState("");
  // cartItems: Danh sách thuốc muốn bán [{ medId, qty, price, name }]
  const [cartItems, setCartItems] = useState([{ medId: "", qty: 1, price: 0 }]); 

  // --- 1. LOAD DỮ LIỆU ---
  const loadInvoices = useCallback(async () => {
    try {
      const res = await getInvoicesApi(filterType, searchQuery);
      setInvoices(res.data);
    } catch (error) {
      console.error(error);
    }
  }, [filterType, searchQuery]);

  const loadOptions = useCallback(async () => {
    try {
      const mRes = await getMedicineOptionsApi();
      setMedOptions(mRes.data); // data gồm: id, name, price, unit
      const cRes = await getCustomersApi();
      setCusOptions(cRes.data);
    } catch (error) { console.error(error); }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadInvoices();
  }, [loadInvoices]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (showAddForm) loadOptions();
  }, [showAddForm, loadOptions]);

  // --- 2. XỬ LÝ FORM THÊM HÓA ĐƠN (CART LOGIC) ---
  
  // Thay đổi thuốc hoặc số lượng trên 1 dòng
  const handleCartChange = (index, field, value) => {
    const newCart = [...cartItems];
    if (field === "medId") {
      const med = medOptions.find(m => m.id === Number(value));
      newCart[index].medId = value;
      newCart[index].price = med ? med.price : 0; // Tự điền giá
      newCart[index].name = med ? med.name : "";
    } else {
      newCart[index][field] = value;
    }
    setCartItems(newCart);
  };

  // Thêm dòng mới
  const addCartLine = () => {
    setCartItems([...cartItems, { medId: "", qty: 1, price: 0 }]);
  };

  // Xóa dòng
  const removeCartLine = (index) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    setCartItems(newCart);
  };

  // Tính tổng tiền tạm tính trên Form
  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  };

  // Gửi API tạo hóa đơn
  const handleSaveInvoice = async () => {
    // Validate
    const validItems = cartItems.filter(i => i.medId && i.qty > 0);
    if (validItems.length === 0) return alert("Vui lòng chọn ít nhất 1 thuốc!");

    const payload = {
      customer_id: selectedCustomer || null,
      details: validItems.map(i => ({
        medicine_id: i.medId,
        quantity: i.qty
      }))
    };

    try {
      await createInvoiceApi(payload);
      alert("Tạo hóa đơn thành công!");
      setShowAddForm(false);
      setCartItems([{ medId: "", qty: 1, price: 0 }]); // Reset
      setSelectedCustomer("");
      loadInvoices(); // Reload bảng
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.msg || error.message));
    }
  };

  return (
    <div className={styles.medicineContainer}>
      <h1 className={styles.pageTitle}>Quản lý Hóa đơn</h1>

      {/* THANH CHỨC NĂNG */}
      <div className={styles.actionBar}>
        <div className={styles.actionGroup}>
            <button 
              onClick={() => setShowAddForm(true)} 
              className={`${styles.btn} ${styles["btn-primary"]}`}
            >
              + Tạo hóa đơn mới
            </button>
            <button 
              onClick={() => setShowSearchForm(true)} 
              className={`${styles.btn} ${styles["btn-secondary"]}`}
            >
              🔍 Tìm hóa đơn
            </button>
        </div>
        
        {/* THANH LỌC */}
        <div className={styles.actionGroup}>
            <button 
              onClick={() => setFilterType("today")} 
              className={`${styles.btn} ${filterType==="today" ? styles["btn-info"] : styles["btn-secondary"]}`}
            >
              Hôm nay
            </button>
            <button 
              onClick={() => setFilterType("week")} 
              className={`${styles.btn} ${filterType==="week" ? styles["btn-info"] : styles["btn-secondary"]}`}
            >
              Tuần này
            </button>
            <button 
              onClick={() => setFilterType("month")} 
              className={`${styles.btn} ${filterType==="month" ? styles["btn-info"] : styles["btn-secondary"]}`}
            >
              Tháng này
            </button>
            <button 
              onClick={() => setFilterType("all")} 
              className={`${styles.btn} ${filterType==="all" ? styles["btn-info"] : styles["btn-secondary"]}`}
            >
              Tất cả
            </button>
        </div>
      </div>

      {/* MODAL TẠO HÓA ĐƠN */}
      {showAddForm && (
        <div className={styles.modalOverlay}>
          {/* Kết hợp 2 class */}
          <div className={`${styles.modalContent} ${styles.large}`}>
            <h2 className={styles.modalTitle}>Tạo Hóa Đơn Bán Hàng</h2>
            
            {/* Chọn khách hàng */}
            <div style={{marginBottom: 20}}>
                <label style={{fontWeight: "bold"}}>Khách hàng:</label>
                <select 
                  className={styles.formSelect} 
                  value={selectedCustomer} 
                  onChange={e => setSelectedCustomer(e.target.value)}
                >
                    <option value="">-- Khách lẻ --</option>
                    {cusOptions.map(c => <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>)}
                </select>
            </div>

            {/* Danh sách thuốc (Cart) */}
            <table className={styles.medicineTable}>
                <thead>
                    <tr><th>Thuốc</th><th style={{width: 80}}>SL</th><th>Đơn giá</th><th>Thành tiền</th><th>#</th></tr>
                </thead>
                <tbody>
                    {cartItems.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <select 
                                  className={styles.formSelect} 
                                  value={item.medId} 
                                  onChange={e => handleCartChange(index, "medId", e.target.value)}
                                >
                                    <option value="">-- Chọn thuốc --</option>
                                    {medOptions.map(m => <option key={m.id} value={m.id}>{m.name} (Tồn: ?)</option>)}
                                </select>
                            </td>
                            <td>
                                <input 
                                  type="number" 
                                  className={styles.formInput} 
                                  min="1" 
                                  value={item.qty} 
                                  onChange={e => handleCartChange(index, "qty", Number(e.target.value))} 
                                />
                            </td>
                            <td>{item.price.toLocaleString()}</td>
                            <td>{(item.price * item.qty).toLocaleString()}</td>
                            <td>
                                {cartItems.length > 1 && (
                                    <button 
                                      onClick={() => removeCartLine(index)} 
                                      className={`${styles.btn} ${styles["btn-danger"]}`} 
                                      style={{padding: "5px 10px"}}
                                    >
                                      X
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <button 
              onClick={addCartLine} 
              className={`${styles.btn} ${styles["btn-secondary"]}`} 
              style={{marginTop: 10, width: "100%"}}
            >
              + Thêm dòng thuốc
            </button>

            <div style={{marginTop: 20, textAlign: "right", fontSize: 18, fontWeight: "bold", color: "#2563eb"}}>
                Tổng cộng: {calculateTotal().toLocaleString('vi-VN')}₫
            </div>

            <div className={styles.modalActions}>
              <button 
                onClick={() => setShowAddForm(false)} 
                className={`${styles.btn} ${styles["btn-secondary"]}`}
              >
                Hủy
              </button>
              <button 
                onClick={handleSaveInvoice} 
                className={`${styles.btn} ${styles["btn-success"]}`}
              >
                Lưu & In hóa đơn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TÌM KIẾM */}
      {showSearchForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
             <h2 className={styles.modalTitle}>Tìm kiếm hóa đơn</h2>
             <div className={styles.searchBox}>
                 <input 
                    className={styles.formInput} 
                    placeholder="Nhập mã HĐ hoặc tên khách..." 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                 />
                 <button 
                    onClick={loadInvoices} 
                    className={`${styles.btn} ${styles["btn-primary"]}`}
                 >
                    Tìm
                 </button>
             </div>
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

      {/* BẢNG DANH SÁCH */}
      <table className={styles.medicineTable}>
        <thead>
          <tr>
            <th>Mã HĐ</th>
            <th>Ngày tạo</th>
            <th>Khách hàng</th>
            <th className={styles["text-right"]}>Tổng tiền</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length > 0 ? invoices.map(inv => (
            <tr key={inv.id}>
              <td style={{fontWeight: "bold"}}>#{inv.id}</td>
              <td>{inv.date}</td>
              <td>{inv.customer_name}</td>
              <td className={styles["text-right"]} style={{color: "#2563eb", fontWeight: "bold"}}>
                {inv.total.toLocaleString('vi-VN')}₫
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="4" className={styles["no-data"]}>
                Không có hóa đơn nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}