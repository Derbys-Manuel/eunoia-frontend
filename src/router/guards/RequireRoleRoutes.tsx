import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { RoutesPaths } from "../../router/config/routesPaths";
import { RoleType } from "../../types/Role";
import type { PropsUrl } from "../guards/typeGuards";
import { ROLE_ALLOWED} from "../config/persmission";
import { isPathAllowed } from "../guards/helpers/isPathAllowed";

const isRoleType = (value: unknown): value is RoleType =>
  typeof value === "string" && Object.values(RoleType).includes(value as RoleType);

const RequireRoleRoutes = ({ children }: PropsUrl) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  const { pathname } = useLocation();

  if (loading) return <div className="p-4">Cargando...</div>;
  if (!isAuthenticated) return <Navigate to={RoutesPaths.login} replace />;

  const role: RoleType = isRoleType(userRole) ? userRole : RoleType.ADVISER;

  const allowed = ROLE_ALLOWED[role];

  if (!isPathAllowed(pathname, allowed)) {
    return <Navigate to={RoutesPaths.denied} replace />;
  }

  return children;
};

export default RequireRoleRoutes;
