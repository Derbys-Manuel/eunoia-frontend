// permissions.ts
import { RoleType } from "../../types/Role";
import { RoutesPaths } from "../config/routesPaths";

export const ROLE_ALLOWED: Record<RoleType, string[]> = {
  [RoleType.ADMIN]: [
    RoutesPaths.home,
    RoutesPaths.users,
    RoutesPaths.denied,
  ],
  [RoleType.ADVISER]: [
    RoutesPaths.home,
    RoutesPaths.denied,
  ],
  [RoleType.MODERATOR]: [
    RoutesPaths.home,
    RoutesPaths.denied,
  ],
};

// export const ROLE_DEFAULT: Record<RoleType, string> = {
//   [RoleType.ADMIN]: RoutesPaths.home,
//   [RoleType.ADVISER]: RoutesPaths.home,
//   [RoleType.MODERATOR]: RoutesPaths.home,
// };
