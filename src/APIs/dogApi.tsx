import {
  CreateDogErrorResponse,
  CreateDogSuccessResponse,
  DogFormDetails,
} from "@/Interface/dogInterface";
import { http } from "@/util";

export const createDogLog = async (
  dog: DogFormDetails
): Promise<CreateDogSuccessResponse | CreateDogErrorResponse> => {
  try {
    const response = await http.request({
      url: "/createDogLog",
      method: "POST",
      data: dog,
    });

    return response.data;
  } catch (error) {
    const apiError = error as CreateDogErrorResponse;
    return apiError;
  }
};

export const getDogLog = async (
  id: string
): Promise<CreateDogSuccessResponse | CreateDogErrorResponse> => {
  try {
    const response = await http.request({
      url: `/getDogLog/${id}`,
      method: "GET",
    });

    return response.data;
  } catch (error) {
    const apiError = error as CreateDogErrorResponse;
    return apiError;
  }
};

export const updateDogLog = async (
  dog: DogFormDetails
): Promise<CreateDogSuccessResponse | CreateDogErrorResponse> => {
  try {
    const response = await http.request({
      url: `/updateDogLog/${dog.dogLogId}`,
      method: "PUT",
      data: dog,
    });

    return response.data;
  } catch (error) {
    const apiError = error as CreateDogErrorResponse;
    return apiError;
  }
};
