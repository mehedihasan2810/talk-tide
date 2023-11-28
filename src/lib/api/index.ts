import axios from "axios";

// Create an Axios instance for API requests
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
  withCredentials: true,
  timeout: 120000,
});

export { apiClient };
