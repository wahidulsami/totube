import axios from 'axios';

const api = axios.create({
  baseURL: "https://backendv1-a60l.onrender.com/api/v1",
  withCredentials: true,
});

export default api;
