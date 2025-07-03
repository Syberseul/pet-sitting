export interface SignUpRequest {
  userName: string;
  password: string;
  email: string;
}

export interface SignUpSuccessResponse {
  uid: string;
  userName: string;
  email: string;
  token: string;
  refreshToken: string;
  role: number;
  customToken: string;
  dogOwnerRefNo?: string;
}

export interface SignUpErrorResponse {
  error: string;
  code: number;
}

export interface LinkUserErrorResponse {
  code: number;
  details: {
    code: number;
    error: string;
  };
}

export const isSignUpSuccess = (
  res: SignUpSuccessResponse | SignUpErrorResponse
): res is SignUpSuccessResponse => {
  return (res as SignUpSuccessResponse).uid != undefined;
};

export const isLinkUserSuccess = (
  res: SignUpSuccessResponse | LinkUserErrorResponse
): res is SignUpSuccessResponse => {
  return (res as SignUpSuccessResponse).uid != undefined;
};

export interface SignInRequest {
  password: string;
  email: string;
}
