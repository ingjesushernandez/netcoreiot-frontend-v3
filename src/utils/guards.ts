export const isProtectedUser = (role?: IRole) => {
  if (role?.key === "superadmin") return true;
  if (Array.isArray(role?.permissions) && role.permissions.includes("*")) return true;
  return false;
};
