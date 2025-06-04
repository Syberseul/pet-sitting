import {
  CreateDogOwnerErrorResponse,
  CreateDogOwnerSuccessResponse,
  DogOwner,
  getDogOwnersFail,
  getDogOwnersSuccess,
} from "@/Interface/dogOwnerInterface";
import { http } from "@/util";

export const createDogOwner = async (
  owner: DogOwner
): Promise<CreateDogOwnerSuccessResponse | CreateDogOwnerErrorResponse> => {
  try {
    const response = await http.request({
      url: "/owner/create",
      method: "POST",
      data: owner,
    });

    return response.data;
  } catch (error) {
    const apiError = error as CreateDogOwnerErrorResponse;
    return apiError;
  }
};

export const updateDogOwner = async (
  owner: DogOwner
): Promise<CreateDogOwnerSuccessResponse | CreateDogOwnerErrorResponse> => {
  try {
    if (!owner.uid)
      return {
        error: "Missing required properties",
        details: "Missing owner ID",
      };
    const response = await http.request({
      url: `/owner/update/${owner.uid!}`,
      method: "PUT",
      data: owner,
    });

    return response.data;
  } catch (error) {
    const apiError = error as CreateDogOwnerErrorResponse;
    return apiError;
  }
};

export const getDogOwners = async (): Promise<
  getDogOwnersSuccess | getDogOwnersFail
> => {
  try {
    const response = await http.request({
      url: "/owner/all",
      method: "GET",
    });

    return response;
  } catch (error) {
    const apiError = error as getDogOwnersFail;
    return apiError;
  }
};
