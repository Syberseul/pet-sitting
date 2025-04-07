export interface SignUpRequest {
  username: string;
  password: string;
  email: string;
}

export interface SignUpSuccessResponse {
  uid: string;
  username: string;
  email: string;
  token: string;
  refreshToken: string;
  role: number;
  error: string;
}

export interface SignUpErrorResponse {
  error: string;
}

export const isSignUpSuccess = (
  res: SignUpSuccessResponse | SignUpErrorResponse
): res is SignUpSuccessResponse => {
  return (res as SignUpSuccessResponse).uid != undefined;
};

export interface SignInRequest {
  password: string;
  email: string;
}
