// In API/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5500/api", // Make sure this is correct
  // baseURL: "https://forumbackend.abdisaketema.com/api", // Make sure this is correct

  timeout: 10000, // Add timeout
});

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
