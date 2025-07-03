import { DogInfo, DogInfoCreate } from "./dogInterface";

export interface DogOwner {
  name: string;
  dogs: DogInfo[] | DogInfoCreate[];
  isFromWx: boolean;
  wxId?: string;
  contactNo?: string;
  userId?: string;
  uid?: string;
  userRefNo?: string;
  linkedDogOwner?: boolean;
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
) => !(res as getDogOwnersFail).error;

export interface getUserRefCodeSuccess {
  data: {
    userRefNo: string;
  };
}

export const isGetUserRefCodeSuccess = (
  res: getUserRefCodeSuccess | getDogOwnersFail
) => !(res as getDogOwnersFail).error;
