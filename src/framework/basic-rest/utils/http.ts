import axios from "axios";

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REST_API_ENDPOINT,
  method: "post",
  timeout: 30000,
  withCredentials: true, // ✅ correct property
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default http;
