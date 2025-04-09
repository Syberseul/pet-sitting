import axios, { AxiosError, AxiosResponse } from "axios";
import { getToken } from "./token";
import { SignUpErrorResponse } from "@/Interface/authInterface";
import { userRefreshToken } from "@/store/modules/userStore";
import { RefreshTokenResponse } from "@/Interface/apiInterface";
import store from "@/store";

const requestInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
});

requestInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) config.headers.Authorization = `Bearer ${token}`;

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
  async (error: AxiosError) => {
    const apiError = {
      message: error.message || error,
      code: error.response?.status || 500,
      details: error.response?.data as { error?: string },
    };

    if (apiError.details?.error == "Token has expired") {
      const originalRequest = error.config;
      const dispatch = store.dispatch;

      const user = localStorage.getItem("userInfo");

      if (!user) return Promise.reject(apiError);

      const userData = JSON.parse(user);

      try {
        const response = await requestInstance.post<RefreshTokenResponse>(
          "/refreshToken",
          {
            uid: userData.uid,
            token: userData.token,
            refreshToken: userData.refreshToken,
            email: userData.email,
          }
        );

        dispatch(
          userRefreshToken({
            uid: userData.uid,
            token: response.data.token,
            refreshToken: response.data.refreshToken,
            email: userData.email,
          })
        );

        if (originalRequest) {
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          return requestInstance(originalRequest);
        }
      } catch (error) {
        const apiError = error as SignUpErrorResponse;
        return apiError;
      }
    }

    return Promise.reject(apiError);
  }
);

export { requestInstance };
