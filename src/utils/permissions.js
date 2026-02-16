export const canDeleteUser = (role) => role === "admin";
export const canEditUser = (role) =>
  role === "admin" || role === "editor";
export const canAddUser = (role) =>
  role === "admin" || role === "editor";
export const canViewAnalytics = (role) =>
  role === "admin" || role=== "editor" || role==="viewer";
