import axios from 'axios';

const api = axios.create({
  baseURL: "https://backend-rmg0.onrender.com,
  withCredentials: true,
});

export default api;
