import { useState } from "react";
import { addMedicineApi } from "../../api/medicineApi";
import styles from "./AddMedicineModal.module.css";

export default function AddMedicineModal({ isOpen, onClose, onSuccess, supplierOptions }) {
  const [newMedData, setNewMedData] = useState({ name: "", category: "", unit: "", price: "", supplierId: "", description: "" });

  const handleChange = (e) => {
    setNewMedData({ ...newMedData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!newMedData.name || !newMedData.price || !newMedData.supplierId) {
      return alert("Tên, Giá và Nhà cung cấp là bắt buộc!");
    }
    try {
      await addMedicineApi({
        name: newMedData.name,
        category: newMedData.category,
        unit: newMedData.unit,
        price: newMedData.price,
        supplier_id: newMedData.supplierId,
        description: newMedData.description
      });
      
      alert("Thêm thuốc mới thành công!");
      setNewMedData({ name: "", category: "", unit: "", price: "", supplierId: "", description: "" }); // Reset form
      onSuccess();
      onClose();
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.msg || error.message));
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Thêm thuốc mới</h2>
        <div className={styles.formGroup}>
          <input className={styles.formInput} name="name" placeholder="Tên thuốc (*)" value={newMedData.name} onChange={handleChange} />
          <input className={styles.formInput} name="category" placeholder="Danh mục" value={newMedData.category} onChange={handleChange} />
          <input className={styles.formInput} name="unit" placeholder="Đơn vị tính" value={newMedData.unit} onChange={handleChange} />
          <input className={styles.formInput} name="price" type="number" placeholder="Giá bán (*)" value={newMedData.price} onChange={handleChange} />
          
          <select className={styles.formSelect} name="supplierId" value={newMedData.supplierId} onChange={handleChange}>
            <option value="">-- Chọn Nhà Cung Cấp (*) --</option>
            {supplierOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          
          <textarea className={styles.formTextarea} name="description" placeholder="Mô tả..." value={newMedData.description} onChange={handleChange} />
        </div>
        <div className={styles.modalActions}>
          <button onClick={onClose} className={`${styles.btn} ${styles["btn-secondary"]}`}>Hủy</button>
          <button onClick={handleSave} className={`${styles.btn} ${styles["btn-success"]}`}>Lưu</button>
        </div>
      </div>
    </div>
  );
}