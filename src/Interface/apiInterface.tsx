export interface ApiResponse<T> {
  data?: T;
  error?: errorStructure;
  token?: string;
  refresh_token: string;
}

export interface ResType<T> {
  message: string;
  data: T;
}

export interface errorStructure {
  message: string;
  code?: number;
  details?: any;
}
