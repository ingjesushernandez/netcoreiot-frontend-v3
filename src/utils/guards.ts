export const isProtectedUser = (u?: any, superId?: string) => {
  if (!u) return false;
  if (superId && u._id === superId) return true;
  if (u.role?.key === "superadmin") return true;
  if (Array.isArray(u.role?.permissions) && u.role.permissions.includes("*")) return true;
  return false;
};
