export interface LoginI {
  email: string;
  password: string;
}

export interface BaseResponse {
  code: number;
  description: string;
}

export interface LoginResponseI extends BaseResponse {
  token: string;
}
