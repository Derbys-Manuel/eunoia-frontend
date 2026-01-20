import axiosInstance from "@/common/utils/axios";
import { API_AUTH_GROUP } from "./APIs";
import { LoginCredentials, RegisterCredentials } from "@/types/auth";

interface AuthService {
  access_token: string;
  refresh_token?: string;
  role: string;
  [key: string]: any;
}

/**
 * Inicia sesión de usuario.
 * @param {LoginCredentials} payload - Credenciales de acceso.
 * @returns {Promise<AuthService>} Respuesta con los tokens y datos del usuario.
 */
export const loginUser = async (payload: LoginCredentials):Promise<AuthService> => {
  try {
    const response = await axiosInstance.post(API_AUTH_GROUP.authentication, payload);
    return response.data;
  } catch (error) {
    console.error("error en loginUser",error);
    throw error;
  }
};

/**
 * Registra un nuevo usuario.
 * @param {RegisterCredentials} payload - Datos de registro.
 * @returns {Promise<AuthService>} Respuesta con tokens y datos del usuario registrado.
 */
export const registerUser = async (payload: RegisterCredentials):Promise<AuthService> => {
  try {
    const response = await axiosInstance.post(API_AUTH_GROUP.register, payload)
    return response.data;
  } catch (error) {
    console.error("error en registerUser",error);
    throw error;
  }
}

/**
 * Verifica la validez del token JWT.
 * @returns {Promise<boolean>} `true` si el token es válido.
 */
export const checkTokenValidity = async () => {
  try {
    const response = await axiosInstance.get(API_AUTH_GROUP.validateToken);
    return response.data.message === 'Token es válido';
  } catch (error) {
    console.error("Token no válido o expirado", error);
    return false;
  }
}
export const refresh_token = async () => {
  try {
    const response = await axiosInstance.get(API_AUTH_GROUP.refreshToken);
    // ⚡ devuelve solo el token en texto
    return response.data?.access_token || null;
  } catch (error) {
    console.error("Error al refrescar token:", error);
    return null;
  }
}
export const logoutUser = async () => {
  try {
    const response = await axiosInstance.post(API_AUTH_GROUP.logout)
    return response.data
  } catch (error) {
    return false 
  }
}