import type { AppRoute } from "../types/RouterTypes";
import { RoutesPaths } from "../config/routesPaths";
import LoginPage from "../../pages/auth/LoginPage";
import RegisterPage from "../../pages/auth/RegisterPage";

export const authRoutes: AppRoute[] = [
  { path: RoutesPaths.login, element: <LoginPage /> },
  { path: RoutesPaths.register, element: <RegisterPage /> },
];
