import { Navigate } from "react-router-dom";
import { RoutesPaths } from "../config/routesPaths";
import { useAuth } from "@/hooks/useAuth";
import type { JSX } from "react";

type Props = {
  children: JSX.Element;
};

export default function AuthGuards({ children }: Props) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="p-4">Cargando...</div>;
  if (!isAuthenticated) {
    return <Navigate to={RoutesPaths.login} replace />;
  }
  return children;
}
