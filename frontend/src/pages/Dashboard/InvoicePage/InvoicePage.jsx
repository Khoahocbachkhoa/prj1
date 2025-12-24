import { useState, useEffect, useCallback } from "react";
import { getInvoicesApi } from "../../../api/invoiceApi";

import AddInvoiceModal from "../../../components/InvoicePage/AddInvoiceModal";
import SearchInvoiceModal from "../../../components/InvoicePage/SearchInvoiceModal";
import InvoiceTable from "../../../components/InvoicePage/InvoiceTable";

import styles from "./InvoicePage.module.css";

export default function InvoicePage() {
  const [invoices, setInvoices] = useState([]);
  const [filterType, setFilterType] = useState("all"); // quản lý lọc hóa đơn
  const [searchQuery, setSearchQuery] = useState(""); // quản lý trạng thái tìm kiếm

  const [showAddForm, setShowAddForm] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);

  const loadInvoices = useCallback(async () => {
    const res = await getInvoicesApi(filterType, searchQuery);
    setInvoices(res.data);
  }, [filterType, searchQuery]);

  const handleSearch = async () => {
    await loadInvoices();      // load data
    setShowSearchForm(false);  // đóng modal
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadInvoices();
  }, [loadInvoices]);

  return (
    <div className={styles.invoiceContainer}>
      <h2 className={styles.pageTitle}>Quản lý Hóa đơn</h2>

      {/* ACTION BAR */}
      <div className={styles.actionBar}>
        <div className={styles.actionGroup}>
          <button
            className={`${styles.btn} ${styles["btn-primary"]}`}
            onClick={() => setShowAddForm(true)}
          >
            + Tạo hóa đơn
          </button>

          <button
            className={`${styles.btn} ${styles["btn-info"]}`}
            onClick={() => setShowSearchForm(true)}
          >
            Lọc hóa đơn
          </button>
        </div>

        <div className={styles.actionGroup}>
          <button
            className={`${styles.btn} ${
              filterType === "today" ? styles["btn-primary"] : styles["btn-secondary"]
            }`}
            onClick={() => setFilterType("today")}
          >
            Hôm nay
          </button>

          <button
            className={`${styles.btn} ${
              filterType === "week" ? styles["btn-primary"] : styles["btn-secondary"]
            }`}
            onClick={() => setFilterType("week")}
          >
            Tuần
          </button>

          <button
            className={`${styles.btn} ${
              filterType === "month" ? styles["btn-primary"] : styles["btn-secondary"]
            }`}
            onClick={() => setFilterType("month")}
          >
            Tháng
          </button>

          <button
            className={`${styles.btn} ${
              filterType === "all" ? styles["btn-primary"] : styles["btn-secondary"]
            }`}
            onClick={() => setFilterType("all")}
          >
            Tất cả
          </button>
        </div>
      </div>

      {/* TABLE */}
      <InvoiceTable invoices={invoices} />

      {/* MODALS */}
      {showAddForm && (
        <AddInvoiceModal
          onClose={() => setShowAddForm(false)}
          onSuccess={loadInvoices}
        />
      )}

      {showSearchForm && (
        <SearchInvoiceModal
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          onClose={() => setShowSearchForm(false)}
        />
      )}
    </div>
  );
}