import { JSX, Suspense, lazy } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Layout from "../components/layout/Layout";
import LoadingFallback from "../components/ui/LoadingFallBack";
import { Role } from "../constants/RolEnum";
import { useAuthStore } from "../store/authStore";
import { getHomePageByRole, isValidRole } from "../utils";
import RoleBasedRoute, { AppRoute } from "./RoleBasedRoute";

// Carga diferida de componentes
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const Login = lazy(() => import("../pages/login/Login"));
const Register = lazy(() => import("../pages/register/Register"));
const Profile = lazy(() => import("../pages/profile/Profile"));
const Trainers = lazy(() => import("../pages/trainers/Trainers"));
const Unauthorized = lazy(() => import("../pages/Unauthorized"));
const Users = lazy(() => import("../pages/users/Users"));
const Equipment = lazy(() => import("../pages/equipment/Equipment"));
// const Admin = lazy(() => import("../pages/Admin"));
// Cuando crees las páginas Trainers y Admin, agrégalas aquí:

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
    element: (
      <Layout>
        <Dashboard />
      </Layout>
    ),
    roles: [Role.ADMIN, Role.TRAINER],
    redirectTo: "/profile",
  },
  {
    path: "/profile",
    element: (
      <Layout>
        <Profile />
      </Layout>
    ),
    roles: [Role.USER, Role.TRAINER, Role.ADMIN],
  },
  {
    path: "/trainers",
    element: (
      <Layout>
        <Trainers />
      </Layout>
    ), // Reemplazar con componente real cuando esté creado
    roles: [Role.TRAINER, Role.ADMIN],
  },
  {
    path: "/users",
    element: (
      <Layout>
        <Users />
      </Layout>
    ), // Reemplazar con componente real cuando esté creado
    roles: [Role.ADMIN],
  },
  {
    path: "/equipment",
    element: (
      <Layout>
        <Equipment />
      </Layout>
    ),
    roles: [Role.ADMIN, Role.TRAINER],
  },
  {
    path: "/unauthorized",
    element: (
      <Layout>
        <Unauthorized />
      </Layout>
    ),
    roles: [Role.USER, Role.TRAINER, Role.ADMIN],
  },
];

const AppRoutes = () => (
  <Router>
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Ruta pública - accesible sin autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
    </Suspense>
  </Router>
);

export default AppRoutes;
