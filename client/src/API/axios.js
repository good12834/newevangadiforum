import axios from "axios";

const axiosInstance = axios.create({
   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5500/api",
  // baseURL: 'https://evangadiforum.goodtess.com/',
  timeout: 10000,
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
