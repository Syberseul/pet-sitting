import { SignUpErrorResponse } from "./authInterface";

export interface ApiError {
  message: string;
  code: number;
  details?: SignUpErrorResponse | any;
}
