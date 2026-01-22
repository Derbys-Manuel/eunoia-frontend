// src/Router/guards/helpers/isPathAllowed.ts
export function isPathAllowed(pathname: string, allowed: string[]) {
  return allowed.some(
    (base) => pathname === base || pathname.startsWith(base + "/")
  );
}
