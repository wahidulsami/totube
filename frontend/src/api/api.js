import axios from 'axios'

const api = axios.create({
  baseURL: "https://backendv1-a60l.onrender.com/api/v1", // replace with your backend URL
  withCredentials: true, // important to send cookies
});

export default api;
