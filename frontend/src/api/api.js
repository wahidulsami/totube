import axios from 'axios'

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1", // replace with your backend URL
  withCredentials: true, // important to send cookies
});

export default api;
