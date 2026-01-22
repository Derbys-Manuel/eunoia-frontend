import { RoleType } from "@/types/Role";
import type { ReactElement } from "react";

export type AppRoute = {
  path?: string;
  name?: string;
  element?: ReactElement;
  errorElement?: ReactElement;
  rolesAllowed?: string[];          // Roles permitidos para acceder (futuro control de roles)
  isPublic?: boolean;               // Ruta pública accesible sin autenticación
  isAuthRoute?: boolean;            // Ruta de login o registro
  isProtected?: boolean;            // Ruta protegida (requiere autenticación)
  userRole?: RoleType | null;
};
