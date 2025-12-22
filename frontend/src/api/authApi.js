import axiosClient from "./axiosClient";

export const loginApi = (username, password) => {
  return axiosClient.post(`/login`, {
    username,
    password
  });
};