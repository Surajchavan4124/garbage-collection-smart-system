import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? "https://ecosyz-backend.onrender.com/api" 
    : "http://localhost:10000/api",

  withCredentials: true,
});

export default api;
