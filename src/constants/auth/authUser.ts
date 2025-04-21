import { Role } from "../RolEnum";

export default interface AuthUser {
  token: string;
  type: string;
  email: string;
  role: Role;
}
