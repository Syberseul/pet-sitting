import {
  SignInRequest,
  SignUpErrorResponse,
  SignUpRequest,
  SignUpSuccessResponse,
} from "@/Interface/authInterface";
import { http } from "@/util";

export const signUp = async (
  user: SignUpRequest
): Promise<SignUpSuccessResponse | SignUpErrorResponse> => {
  try {
    const response = await http.request<SignUpSuccessResponse>({
      url: "/register",
      method: "POST",
      data: user,
    });

    return response.data;
  } catch (error) {
    const apiError = error as SignUpErrorResponse;
    return apiError;
  }
};

export const signIn = async (
  user: SignInRequest
): Promise<SignUpSuccessResponse | SignUpErrorResponse> => {
  try {
    const response = await http.request<SignUpSuccessResponse>({
      url: "/login",
      method: "POST",
      data: user,
    });

    return response.data;
  } catch (error) {
    const apiError = error as SignUpErrorResponse;
    return apiError;
  }
};
