import axios, { AxiosInstance } from 'axios';
console.log('process.env.API_URL',process.env.REACT_APP_API_URL)
const baseURL = process.env.REACT_APP_API_URL;
console.log('base',baseURL)
const apiClient: AxiosInstance = axios.create({
  baseURL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error', error);
    return Promise.reject(error);
  }
);


export default apiClient;