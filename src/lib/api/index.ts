// import { LocalStorage } from "@/utils/LocalStorage";
import axios from "axios";

// Create an Axios instance for API requests
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
  withCredentials: true,
  timeout: 120000,
});

// Add an interceptor to set authorization header with user token before requests
// apiClient.interceptors.request.use(
//   function (config) {
//     // Retrieve user token from local storage
//     const token = LocalStorage.get("token");
//     // Set authorization header with bearer token
//     config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   function (error) {
//     return Promise.reject(error);
//   },
// );

export { apiClient };
