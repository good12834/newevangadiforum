// In API/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5500/api",
  timeout: 10000,
});

export default axiosInstance;
