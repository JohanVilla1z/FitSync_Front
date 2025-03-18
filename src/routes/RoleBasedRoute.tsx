import { JSX } from "react";
import { Navigate } from "react-router-dom";
import { Role } from "../constants/RolEnum";
import { useAuthStore } from "../store/authStore";
import { isValidRole, getHomePageByRole } from "../utils";

export interface AppRoute {
  path: string;
  element: JSX.Element;
  roles: Role[];
  redirectTo?: string;
}

const RoleBasedRoute = ({ route }: { route: AppRoute }) => {
  const { user, isAuthenticated } = useAuthStore();
  // Usar isValidRole para validación
  const userRole = isValidRole(user?.role) ? user.role : null;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: route.path }} />;
  }

  if (!userRole || !route.roles.includes(userRole)) {
    // Si hay una redirección específica configurada para la ruta
    if (route.redirectTo) {
      return <Navigate to={route.redirectTo} />;
    }

    // Usar getHomePageByRole para obtener la página apropiada
    return <Navigate to={getHomePageByRole(userRole)} />;
  }

  return route.element;
};

export default RoleBasedRoute;
