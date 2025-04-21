import { Role } from "../constants/RolEnum";

export const getHomePageByRole = (role: Role | null): string => {
  if (!role) return "/unauthorized";

  switch (role) {
    case Role.ADMIN:
      return "/dashboard";
    case Role.TRAINER:
      return "/dashboard";
    case Role.USER:
      return "/profile";
    default:
      return "/unauthorized";
  }
};
