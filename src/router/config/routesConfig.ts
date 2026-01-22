
import { AppRoute } from "../types/RouterTypes";
import { RoutesPaths } from "./routesPaths";

// Carga dinámica de componentes

export const routesConfig: AppRoute[] = [

  // 🔐 Rutas de autenticación
  { path: RoutesPaths.login, isPublic: true },

  // 📊 Dashboard y rutas anidadas bajo DashboardLayout
  { path: RoutesPaths.home, isProtected: true },
  { path: RoutesPaths.users, isProtected: true },
  
   // 🌐 Ruta de error 404
  { path: "*", name: "Error404", isPublic: true }
];
