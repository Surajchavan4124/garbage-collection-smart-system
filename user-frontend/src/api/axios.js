import axios from "axios";

const api = axios.create({
  baseURL: "https://ecosyz-backend.onrender.com/api",
  withCredentials: true,
});

export default api;
