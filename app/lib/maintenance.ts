const maintenanceBypassPaths = [
  "/maintenance",
  "/admin",
  "/api/admin",
  "/api/auth",
  "/login",
];

export function canBypassMaintenance(
  pathname: string
) {
  return maintenanceBypassPaths.some(
    (path) =>
      pathname === path ||
      pathname.startsWith(`${path}/`)
  );
}