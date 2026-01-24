// permissions.ts
import { RoleType } from "../../types/Role";
import { RoutesPaths } from "../config/routesPaths";

export const ROLE_ALLOWED: Record<RoleType, string[]> = {
  [RoleType.ADMIN]: [
    RoutesPaths.home,
    RoutesPaths.users,
    RoutesPaths.createUser,
    RoutesPaths.profileUser,
    RoutesPaths.denied,
  ],
  [RoleType.MODERATOR]: [
    RoutesPaths.home,
    RoutesPaths.users,
    RoutesPaths.createUser,
    RoutesPaths.profileUser,
    RoutesPaths.denied,
  ],
  [RoleType.ADVISER]: [
    RoutesPaths.home,
    RoutesPaths.denied,
    RoutesPaths.profileUser,
  ],
};

