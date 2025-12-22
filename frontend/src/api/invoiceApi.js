import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

// Lấy danh sách hóa đơn (kèm bộ lọc)
export const getInvoicesApi = (filterType, searchQuery) => {
  let url = `${API_URL}/api/invoices?filter=${filterType}`;
  if (searchQuery) {
    url += `&q=${searchQuery}`;
  }
  return axios.get(url);
};

// Tạo hóa đơn mới
export const createInvoiceApi = (data) => {
  return axios.post(`${API_URL}/api/invoices`, data);
};