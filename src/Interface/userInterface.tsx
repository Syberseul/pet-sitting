import { UserRole } from "@/enums";
import { LinkUserErrorResponse } from "./authInterface";

export interface Props {
  toggleShowSignUp: () => void;
}

export interface UserData {
  username: string;
  password: string;
  email: string;
}

export interface UserSignUpFailedInfo {
  showSignUpFailed: boolean;
  errMsg: string;
}

export interface User {
  uid?: string;
  email: string;
  userName: string;
  role: number;
  token: string;
  refreshToken: string;
  isFromWx: boolean;
  wxId: string;
  googleId: string;
  githubId: string;
}

export interface UserStoreData {
  uid: string;
  email: string;
  userName: string;
  token: string;
  refreshToken: string;
  role: UserRole;
}

export interface UserRefreshTokenData {
  uid: string;
  email: string;
  token: string;
  refreshToken: string;
}

export interface UserUpdateData {
  id: string;
  email?: string;
  password?: string;
  userName?: string;
  dogOwnerRefNo?: string;
}

export const isUserUpdateSuccess = (
  res: UserUpdateData | LinkUserErrorResponse
): res is UserUpdateData => {
  return (res as UserUpdateData).id != undefined;
};
