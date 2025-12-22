import axiosClient from "./axiosClient";

export const getCustomersApi = () => {
  return axiosClient.get(`/api/customers`);
};

export const addCustomerApi = (data) => {
  return axiosClient.post(`/api/customers`, data);
};

export const searchCustomerApi = (query) => {
  return axiosClient.get(`/api/customers/search?q=${query}`);
};