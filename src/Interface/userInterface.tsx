export interface Props {
  toggleShowSignUp: () => void;
}

export interface UserData {
  email: string;
  password: string;
  name?: string;
}

export interface UserSignUpFailedInfo {
  showSignUpFailed: boolean;
  errMsg: string;
}

export interface UserStoreData {
  email: string;
  name: string;
  token: string;
  refresh_token: string;
  role: number;
}
