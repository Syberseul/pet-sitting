import axios, { AxiosError, AxiosResponse } from "axios";

const requestInstance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 5000,
});

requestInstance.interceptors.request.use(
  (config) => {
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
