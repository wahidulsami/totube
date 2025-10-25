import axios from 'axios';

const api = axios.create({
  baseURL: "https://backend-b84i.vercel.app",
  withCredentials: true,
});

export default api;
