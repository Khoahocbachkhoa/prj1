import axiosClient from "./axiosClient";

// Lấy danh sách tùy chọn Thuốc
export const getMedicineOptionsApi = () => {
  return axiosClient.get(`/api/options/medicines`);
};

// Lấy danh sách tùy chọn Nhà cung cấp
export const getSupplierOptionsApi = () => {
  return axiosClient.get(`/api/options/suppliers`);
};

// Lấy lịch sử nhập kho (có lọc theo tháng/năm)
export const getImportHistoryApi = (month, year) => {
  let url = `/api/import-receipts`;
  if (month && year) {
    url += `?month=${month}&year=${year}`;
  }
  return axiosClient.get(url);
};

// Tìm kiếm thuốc
export const searchMedicineApi = (query) => {
  return axiosClient.get(`/api/medicines/search?q=${query}`);
};

// Thêm thuốc mới
export const addMedicineApi = (data) => {
  return axiosClient.post(`/api/medicines`, data);
};

// Tạo phiếu nhập kho
export const createImportReceiptApi = (data) => {
  return axiosClient.post(`/api/import-receipts`, data);
};