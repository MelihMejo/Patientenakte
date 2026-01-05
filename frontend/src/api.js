import axios from "axios";

// In dev, Vite proxy forwards /api to http://localhost:5000
// In production you can set VITE_API_URL to your backend URL (e.g. https://example.com/api)
const baseURL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({ baseURL });
