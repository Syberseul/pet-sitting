import axios, { AxiosError, AxiosResponse } from "axios";
import { getToken } from "./token";

const requestInstance = axios.create({
  // baseURL: "http://localhost:3000",
  baseURL: "https://backend-git-master-syberseuls-projects.vercel.app/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json", // 明确声明内容类型
    "Access-Control-Allow-Origin": "*", // 仅用于调试，生产环境应替换为具体域名
  },
});

requestInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) config.headers.Authorization = `Bearer ${token}`;
    console.log(config);

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

requestInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const apiError = {
      message: error.message || error,
      code: error.response?.status || 500,
      details: error.response?.data,
    };
    return Promise.reject(apiError);
  }
);

export { requestInstance };
