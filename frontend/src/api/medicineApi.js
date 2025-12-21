import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

// Lấy danh sách tùy chọn Thuốc
export const getMedicineOptionsApi = () => {
  return axios.get(`${API_URL}/api/options/medicines`);
};

// Lấy danh sách tùy chọn Nhà cung cấp
export const getSupplierOptionsApi = () => {
  return axios.get(`${API_URL}/api/options/suppliers`);
};

// Lấy lịch sử nhập kho (có lọc theo tháng/năm)
export const getImportHistoryApi = (month, year) => {
  let url = `${API_URL}/api/import-receipts`;
  if (month && year) {
    url += `?month=${month}&year=${year}`;
  }
  return axios.get(url);
};

// Tìm kiếm thuốc
export const searchMedicineApi = (query) => {
  return axios.get(`${API_URL}/api/medicines/search?q=${query}`);
};

// Thêm thuốc mới
export const addMedicineApi = (data) => {
  return axios.post(`${API_URL}/api/medicines`, data);
};

// Tạo phiếu nhập kho
export const createImportReceiptApi = (data) => {
  return axios.post(`${API_URL}/api/import-receipts`, data);
};