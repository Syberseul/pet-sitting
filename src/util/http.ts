import axios, { AxiosError, AxiosResponse } from "axios";
import { getToken } from "./token";
import { SignUpErrorResponse } from "@/Interface/authInterface";
import { userLogout, userRefreshToken } from "@/store/modules/userStore";
import { RefreshTokenResponse } from "@/Interface/apiInterface";
import store from "@/store";
import { getAuth, signInWithCustomToken } from "firebase/auth";

const requestInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
});

requestInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) config.headers.Authorization = `Bearer ${token}`;

    config.headers.Platform = "WEB";

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
          "users/refreshToken",
          {
            uid: userData.uid,
            token: userData.token,
            refreshToken: userData.refreshToken,
            email: userData.email,
          }
        );

        const apiError = {
          error: "Failed refresh token!",
          code: 400,
        } as SignUpErrorResponse;

        if (!response.data.token) {
          dispatch(userLogout());
          return apiError;
        }

        try {
          const auth = getAuth();
          const userCredential = await signInWithCustomToken(
            auth,
            response.data.token
          );
          const newFirebaseToken = await userCredential.user.getIdToken();

          dispatch(
            userRefreshToken({
              uid: userData.uid,
              token: newFirebaseToken,
              refreshToken: response.data.refreshToken,
              email: userData.email,
            })
          );

          if (originalRequest) {
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            return requestInstance(originalRequest);
          }
        } catch (err) {
          dispatch(userLogout());
          console.log(err);
          return apiError;
        }
      } catch (error) {
        const apiError = error as SignUpErrorResponse;
        dispatch(userLogout());
        console.log(error);
        return apiError;
      }
    }

    return Promise.reject(apiError);
  }
);

export { requestInstance };
