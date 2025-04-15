import { Role } from '../RolEnum';

export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  email: string;
  Role: Role;
}
