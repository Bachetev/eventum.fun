import axios from "axios";
export const api = axios.create({ baseURL: "http://localhost:4000", withCredentials: true });
api.interceptors.response.use(r=>r,(err)=>{ if (err?.response?.status===401) err.isUnauthorized=true; return Promise.reject(err); });
