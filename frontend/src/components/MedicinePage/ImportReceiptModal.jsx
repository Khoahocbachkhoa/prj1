import { useState, useEffect } from "react";
import { createImportReceiptApi } from "../../api/medicineApi";
import styles from "./ImportReceiptModal.module.css";

export default function ImportReceiptModal({ isOpen, onClose, onSuccess, medicineOptions, supplierOptions }) {
  const [formData, setFormData] = useState({ medicineId: "", supplierId: "", qty: "", price: "" });

  // Reset form mỗi khi mở modal
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isOpen) setFormData({ medicineId: "", supplierId: "", qty: "", price: "" });
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "medicineId") {
      const selectedMed = medicineOptions.find(m => m.id === Number(value));
      setFormData({ 
        ...formData, 
        [name]: value, 
        price: selectedMed ? selectedMed.price : formData.price 
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!formData.medicineId || !formData.supplierId || !formData.qty || !formData.price) {
      return alert("Vui lòng nhập đầy đủ thông tin!");
    }
    try {
      await createImportReceiptApi({
        supplier_id: formData.supplierId,
        medicine_id: formData.medicineId,
        quantity: formData.qty,
        price: formData.price
      });
      alert("Nhập kho thành công!");
      onSuccess();
      onClose();
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.msg || "Hệ thống lỗi"));
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Phiếu Nhập Kho</h2>
        <div className={styles.formGroup}>
          <select 
            className={styles.formSelect} 
            name="medicineId" 
            value={formData.medicineId} 
            onChange={handleInputChange}
          >
            <option value="">-- Chọn thuốc --</option>
            {medicineOptions.map(m => <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>)}
          </select>

          <select 
            className={styles.formSelect} 
            name="supplierId" 
            value={formData.supplierId} 
            onChange={handleInputChange}
          >
            <option value="">-- Chọn NCC --</option>
            {supplierOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

          <input 
            className={styles.formInput} 
            name="qty" 
            type="number" 
            placeholder="Số lượng" 
            value={formData.qty} 
            onChange={handleInputChange} 
          />
          <input 
            className={styles.formInput} 
            name="price" 
            type="number" 
            placeholder="Giá nhập" 
            value={formData.price} 
            onChange={handleInputChange} 
          />
        </div>
        <div className={styles.modalActions}>
          <button onClick={onClose} className={`${styles.btn} ${styles["btn-secondary"]}`}>Hủy</button>
          <button onClick={handleSave} className={`${styles.btn} ${styles["btn-success"]}`}>Lưu phiếu</button>
        </div>
      </div>
    </div>
  );
}