import { SignUpErrorResponse } from "./authInterface";

export interface ApiError {
  message: string;
  code: number;
  details?: SignUpErrorResponse | any;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  uid: string;
}
