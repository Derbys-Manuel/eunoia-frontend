/**
 * Grupo de rutas para la autenticación.
 */
export const API_AUTH_GROUP = {
  authentication: '/auth/login',
  logout: '/auth/logout',
  refreshToken: '/auth/refresh',
  validateToken: '/auth/validate-token',
};

/**
 * Grupo de rutas para la gestión de usuarios.
 */
export const API_USERS_GROUP = {
  base: "/users", 
  createUser: '/users/create',
  findAll: '/users/findAll',
  findActives: '/users/actives',
  findDesactive: '/users/desactive',
  findOwnUser: '/users/me',
  findById: (id: string) => `/users/search/${id}`,
  findByEmail: (email: string) => `/users/email/${email}`,
  updateUser: (id: string) => `/users/update/${id}`,
  deleteUser: (id: string) => `/users/delete/${id}`,
  restoreUser: (id: string) => `/users/restore/${id}`,
};

/**
 * Grupo de rutas para la gestion de roles.
 */
export const API_ROLES_GROUP = {
  createRole: "/roles/create",
  findAll: "/roles",
  updateRole: (id: string) => `/roles/update/${id}`,
  deleteRole: (id: string) => `/roles/delete/${id}`,
};


