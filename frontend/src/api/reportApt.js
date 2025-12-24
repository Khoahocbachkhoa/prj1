import axiosClient from "./axiosClient";

// Lấy doanh thu theo tháng
export const getSaleByMonth = () => {
  const now = new Date();

  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  return axiosClient.get(`/api/report/sales/?m=${month}&y=${year}`);
};

// Lấy số hóa đơn trong tháng, năm
export const getNumInvoiceByMonth = () => {
    const now = new Date();

    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    return axiosClient.get(`/api/report/invoices/?m=${month}&y=${year}`);
};

// Lấy danh sách khách mua hàng nhiều nhất
export const getTopCustomer = () => {
    const now = new Date();

    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    return axiosClient.get(`/api/report/customers/?m=${month}&y=${year}`);
}

// Lấy danh sách thuốc bán chạy và thuốc bán ế
export const getReportMedicines = () => {
    const now = new Date();

    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    return axiosClient.get(`/api/report/medicines/?m=${month}&y=${year}`);
}