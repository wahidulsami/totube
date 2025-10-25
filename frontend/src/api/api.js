import axios from 'axios';

const api = axios.create({
  baseURL: "https://backendv1-a60l.onrender.com/api/v1", // backend URL
  withCredentials: true, // send cookies with requests
  headers: {
    'Content-Type': 'application/json', // default JSON content-type
  },
});

export default api;
