import { DogInfo, DogInfoCreate } from "./dogInterface";

export interface DogOwner {
  name: string;
  dogs: DogInfo[] | DogInfoCreate[];
  isFromWx: boolean;
  wxId?: string;
  contactNo?: string;
  userId?: string;
  uid?: string;
}

export interface CreateDogOwnerSuccessResponse {
  data: DogOwner;
}

export interface CreateDogOwnerErrorResponse {
  error: string;
  details: string;
}

export const isCreateDogOwnerSuccess = (
  res: CreateDogOwnerSuccessResponse | CreateDogOwnerErrorResponse
) => {
  return (res as CreateDogOwnerSuccessResponse).data !== undefined;
};

export interface getDogOwnersSuccess {
  data: DogOwner[];
}

export interface getDogOwnersFail {
  error: string;
  details: string;
}

export const isGetDogOwnerSuccess = (
  res: getDogOwnersSuccess | getDogOwnersFail
) => {
  return !(res as getDogOwnersFail).error;
};
