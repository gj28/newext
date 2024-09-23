
import axios from "axios";
import { getCookie } from "cookies-next";

const apiClient = axios.create({
    baseURL: "https://aws.antiai.ltd", // Replace with your API endpoint
})

const getBearerToken = () => {
  return  getCookie("token")
}

// Request interceptor to add Bearer token
apiClient.interceptors.request.use(
    (config) => {
      const token = getBearerToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log('Request:', config);
      return config;
    },
    (error) => {
      console.error('Request Error:', error);
      return Promise.reject(error);
    }
  );

  export default apiClient;