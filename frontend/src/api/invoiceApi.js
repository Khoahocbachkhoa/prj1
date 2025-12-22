import axiosClient from "./axiosClient";

// Lấy danh sách hóa đơn (kèm bộ lọc)
export const getInvoicesApi = (filterType, searchQuery) => {
  let url = `/api/invoices?filter=${filterType}`;
  if (searchQuery) {
    url += `&q=${searchQuery}`;
  }
  return axiosClient.get(url);
};

// Tạo hóa đơn mới
export const createInvoiceApi = (data) => {
  return axiosClient.post(`/api/invoices`, data);
};