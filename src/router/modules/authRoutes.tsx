import type { AppRoute } from "../types/RouterTypes";
import { RoutesPaths } from "../config/routesPaths";
import LoginPage from "../../pages/auth/LoginPage";

export const authRoutes: AppRoute[] = [
  { path: RoutesPaths.login, element: <LoginPage /> },
];
