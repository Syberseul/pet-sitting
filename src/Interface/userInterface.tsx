export interface Props {
  toggleShowSignUp: () => void;
}

export interface UserData {
  username: string;
  password: string;
  email: string;
}

export interface UserStoreData {
  uid: string;
  email: string;
  username: string;
  token: string;
  refreshToken: string;
  role: number;
}

export interface UserRefreshTokenData {
  uid: string;
  email: string;
  token: string;
  refreshToken: string;
}

export interface UserSignUpFailedInfo {
  showSignUpFailed: boolean;
  errMsg: string;
}
