import { JSX } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Role } from "../constants/RolEnum";
import { Dashboard, Login, Profile, Unauthorized } from "../pages";
import { useAuthStore } from "../store/authStore";
import { getHomePageByRole, isValidRole } from "../utils";
import RoleBasedRoute, { AppRoute } from "./RoleBasedRoute";

// Componente para rutas protegidas por autenticación
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// DefaultRedirect para manejar redirección inteligente
const DefaultRedirect = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Usar utilidades para validar rol y obtener página de inicio
  const userRole = isValidRole(user?.role) ? user.role : null;
  return <Navigate to={getHomePageByRole(userRole)} />;
};

// Definición de rutas con control de acceso basado en roles
const routes: AppRoute[] = [
  {
    path: "/dashboard",
    element: <Dashboard />,
    roles: [Role.ADMIN, Role.TRAINER],
    redirectTo: "/profile",
  },
  {
    path: "/profile",
    element: <Profile />,
    roles: [Role.USER, Role.TRAINER, Role.ADMIN],
  },
  // Corregir la ruta duplicada - cambiar a /trainers
  {
    path: "/trainers",
    element: <div>Página de trainers</div>, // Reemplazar con componente real
    roles: [Role.TRAINER, Role.ADMIN],
    redirectTo: "/unauthorized",
  },
  {
    path: "/admin",
    element: <div>Panel de administración</div>, // Reemplazar con componente real
    roles: [Role.ADMIN],
    redirectTo: "/unauthorized",
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
    roles: [Role.USER, Role.TRAINER, Role.ADMIN],
  },
];

const AppRoutes = () => (
  <Router>
    <Routes>
      {/* Ruta pública - accesible sin autenticación */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas con control de acceso basado en roles */}
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<RoleBasedRoute route={route} />}
        />
      ))}

      {/* Ruta por defecto - redirección inteligente */}
      <Route path="*" element={<DefaultRedirect />} />
    </Routes>
  </Router>
);

export default AppRoutes;
