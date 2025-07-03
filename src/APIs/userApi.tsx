import {
  LinkUserErrorResponse,
  SignInRequest,
  SignUpErrorResponse,
  SignUpRequest,
  SignUpSuccessResponse,
} from "@/Interface/authInterface";
import { UserUpdateData } from "@/Interface/userInterface";

import { http } from "@/util";

export const signUp = async (
  user: SignUpRequest
): Promise<SignUpSuccessResponse | SignUpErrorResponse> => {
  try {
    const response = await http.request<SignUpSuccessResponse>({
      url: "users/register",
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
      url: "users/login",
      method: "POST",
      data: user,
    });

    return response.data;
  } catch (error) {
    const apiError = error as SignUpErrorResponse;
    return apiError;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await http.request({
      url: "users/all",
      method: "GET",
    });

    return response.data;
  } catch (error) {
    const apiError = error as SignUpErrorResponse;
    return apiError;
  }
};

// This api is make sure User collection data would have saved into List collection AllUsers document
export const mapUsers = async () => {
  const response = await http.request({
    url: "users/mapUsers",
    method: "POST",
  });
  return response;
};

export const updateUserRole = async (userId: string, role: number) => {
  const response = await http.request({
    url: `users/updateUserRole/${userId}/${role}`,
    method: "PUT",
  });
  return response;
};

export const updateUser = async (
  data: UserUpdateData
): Promise<SignUpSuccessResponse | LinkUserErrorResponse> => {
  try {
    const response = await http.request({
      url: `users/updateUser/${data.id}`,
      method: "PUT",
      data,
    });
    return response.data;
  } catch (error) {
    const apiError = error as LinkUserErrorResponse;
    return apiError;
  }
};

export const updateUserReceiveNotification = async (
  userId: string,
  receiveNotification: number
) => {
  const response = await http.request({
    url: `users/toggleUserReceiveNotification/${userId}/${receiveNotification}`,
    method: "PUT",
  });
  return response;
};
