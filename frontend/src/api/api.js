import axios from 'axios';

const api = axios.create({
  baseURL: "https://backend-rmg0.onrender.com/api/v1",
  withCredentials: true,
});

export default api;
