import { Navigate } from "react-router-dom";
import { RoutesPaths } from "../config/routesPaths";
import type { JSX } from "react";

type Props = {
  children: JSX.Element;
};

export default function AuthGuards({ children }: Props) {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return <Navigate to={RoutesPaths.login} replace />;
  }
  return children;
}
