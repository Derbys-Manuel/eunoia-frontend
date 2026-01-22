import { RouteObject } from "react-router-dom";
import { RoutesPaths } from "../config/routesPaths";
import HomePage from "../../pages/dashboard/HomePage";
import AuthGuards from "../guards/AuthGuards";
import RequireRoleRoutes from "../guards/RequireRoleRoutes";
import { Suspense, lazy } from "react";


const Dashboard = lazy(() => import("../../pages/dashboard/Dashboard"));
const ErrorPage = lazy(() => import("../../pages/Error404"));
const UsersPage = lazy(() => import("../../pages/users/UserPage"));
const AccessDenied = lazy(() => import("../../pages/AccessDenied"));

const suspenseFallback = <div className="p-4">Cargando...</div>;

export const appRoutes: RouteObject[] = [
  {
    path: RoutesPaths.home,
    element: (
      <AuthGuards>
        <RequireRoleRoutes>
            <HomePage />
        </RequireRoleRoutes>
      </AuthGuards>
    ),
    errorElement: (
      <Suspense fallback={suspenseFallback}>
        <ErrorPage />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={suspenseFallback}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: RoutesPaths.users,
        element: (
          <Suspense fallback={suspenseFallback}>
            <UsersPage />
          </Suspense>
        ),
      },
      {
        path: RoutesPaths.denied,
        element: (
          <Suspense fallback={suspenseFallback}>
            <AccessDenied />
          </Suspense>
        ),
      },
  ]
  },
];
