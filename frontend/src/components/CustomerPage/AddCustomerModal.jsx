import { useState } from "react";
import { addCustomerApi } from "../../api/customerApi";

import styles from "./AddCustomerModal.module.css";

export default function AddCustomerModal({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  if (!open) return null;

  const handleSubmit = async () => {
    if (!formData.name) {
      alert("Vui lòng nhập tên khách hàng");
      return;
    }

    try {
      await addCustomerApi(formData);
      alert("Thêm thành công");
      setFormData({ name: "", phone: "", address: "" });
      onClose();
      onSuccess?.();
    } catch (e) {
      alert(e.response?.data?.msg || "Lỗi thêm khách hàng");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Thêm khách hàng</h2>

        <div className={styles.form}>
          <input
            className={styles.input}
            placeholder="Tên khách hàng *"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <input
            className={styles.input}
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />

          <textarea
            className={styles.textarea}
            placeholder="Địa chỉ"
            rows={3}
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>

        <div className={styles.actions}>
          <button onClick={onClose}>Hủy</button>
          <button onClick={handleSubmit}>Lưu</button>
        </div>
      </div>
    </div>
  );
}