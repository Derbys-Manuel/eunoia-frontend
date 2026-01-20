import type { AppRoute } from "../types/RouterTypes";
import { RoutesPaths } from "../config/routesPaths";
import HomePage from "../../pages/dashboard/HomePage";
import AuthGuards from "../guards/AuthGuards";

export const appRoutes: AppRoute[] = [
  {
    path: RoutesPaths.home,
    element: (
      <AuthGuards>
        <HomePage />
      </AuthGuards>
    ),
  },
];
