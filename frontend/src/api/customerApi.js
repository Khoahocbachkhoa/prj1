import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

export const getCustomersApi = () => {
  return axios.get(`${API_URL}/api/customers`);
};

export const addCustomerApi = (data) => {
  return axios.post(`${API_URL}/api/customers`, data);
};

export const searchCustomerApi = (query) => {
  return axios.get(`${API_URL}/api/customers/search?q=${query}`);
};