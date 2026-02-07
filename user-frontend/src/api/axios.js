import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust if backend port differs

  withCredentials: true,
});

export default api;
