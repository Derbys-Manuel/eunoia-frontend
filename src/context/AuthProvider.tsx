import { useState, useEffect } from "react";
import { checkTokenValidity, loginUser, logoutUser } from "@/services/authService";
import { LoginCredentials } from "@/types/auth";
import { PropsUrl } from "@/router/guards/typeGuards";
import { AuthContext } from "./AuthContext";
// import { checkExistingClient } from "@/services/clientsService";
import { findOwnUser } from "@/services/userService";
import { AuthResponse } from "@/types/AuthResponse";

/**
 * Proveedor de autenticación.
 *
 * Maneja la lógica de autenticación, almacenamiento de tokens,
 * verificación de roles y control de estados relacionados a
 * la sesión del usuario.
 *
 * @param {PropsUrl} props Contiene los elementos hijos a renderizar.
 * @returns {JSX.Element} Contexto de autenticación aplicado a los componentes hijos.
 */
export const AuthProvider = ({ children }: PropsUrl) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Verifica la validez del token y actualiza los estados de autenticación.
   * También determina si el usuario tiene un cliente asociado (para el rol 'user').
   */
  const checkAuth = async () => {
    try {
      const valid = await checkTokenValidity();
      if (!valid) {
        setIsAuthenticated(false);
        setUserRole(null);
        setLoading(false);
        return { success: false, message: "Token inválido o expirado" };
      }
      const response = await findOwnUser();
      const user = response?.data ?? response ?? {};
      console.log("Usuario autenticado:", user);
      const rawRoleValue =
        user?.rol ??
        user?.role?.description ??
        user?.role?.name ??
        user?.role ??
        user?.role?.code;
      const rawRole =
        typeof rawRoleValue === "string" ? rawRoleValue.toLowerCase() : "adviser";

      setUserRole(rawRole);
      setUserName(user.user_name ?? user.name ?? user.email ?? null);
      setIsAuthenticated(true);

      // if (rawRole === 'user') {
      //   const exists = await checkExistingClient();
      //   setHasClient(exists);
      // } else {
      //   setHasClient(null);
      // }

      setLoading(false);
      return { success: true, message: "Autenticación validada" };
    } catch (error: any) {
      console.error("Error en checkAuth:", error);
      setIsAuthenticated(false);
      setUserRole(null);
      setUserName(null);
      setLoading(false);
      const message = error.response?.data?.message || "Error inesperado en autenticación";
      return { success: false, message };
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);
  /**
   * Inicia sesión del usuario.
   *
   * @param {LoginCredentials} payload Credenciales del usuario.
   */
  const login = async (payload: LoginCredentials): Promise<AuthResponse> => {
    try {
      const data = await loginUser(payload);

      if (data?.access_token) {
        // 🔹 Guardar token correctamente (solo el string)
        localStorage.setItem("access_token", data.access_token);

        await checkAuth();
        return { success: true, message: "Inicio de sesión exitoso" };
      } else {
        return { success: false, message: "No se pudo iniciar sesión" };
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Error en la autenticación";
      return { success: false, message };
    }
  };

  /**
   * Cierra la sesión actual del usuario.
   */
  const logout = () => {
    logoutUser();
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        userName,
        login,
        logout,
        loading,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
