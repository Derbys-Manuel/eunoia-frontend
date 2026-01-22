import { RouteObject } from "react-router-dom";
import { RoutesPaths } from "../config/routesPaths";
import LoginPage from "../../pages/auth/LoginPage";

export const authRoutes: RouteObject[] = [
  { path: RoutesPaths.login, element: <LoginPage /> },
];
