import axiosInstance from "@/common/utils/axios";
import { API_USERS_GROUP } from "./APIs";
import { UpdateUserDto } from "../types/user";

export const findAll = async (params: {
  page?: number;
  role?: string;
  sortBy?: string;
  order?: "ASC" | "DESC";
}) => {
  const response = await axiosInstance.get(API_USERS_GROUP.findAll, { params });
  return response.data;
};

/**
 * Obtiene usuarios activos.
 * @param {Object} params - Parámetros de búsqueda.
 * @returns {Promise<any>} Lista de usuarios activos.
 */
export const findActives = async (params: {
  page?: number;
  role?: string;
  sortBy?: string;
  order?: "ASC" | "DESC";
}) => {
  const response = await axiosInstance.get(API_USERS_GROUP.findActives, { params });
  return response.data;
};

/**
 * Busca un usuario por ID.
 * @param {string} id - ID del usuario.
 * @returns {Promise<any>} Datos del usuario.
 */
export const findById = async (id: string) => {
  const response = await axiosInstance.get(API_USERS_GROUP.findById(id));
  return response.data;
};

/**
 * Busca un usuario por su email.
 * @param {string} email - Email del usuario.
 * @returns {Promise<any>} Datos del usuario correspondiente.
 */
export const findByEmail = async (email: string) => {
  const response = await axiosInstance.get(API_USERS_GROUP.findByEmail(email));
  return response.data;
};

/**
 * Obtiene la información del usuario autenticado.
 * @returns {Promise<any>} Datos del usuario autenticado.
 */
export const findOwnUser = async () => {
  const response = await axiosInstance.get(API_USERS_GROUP.findOwnUser);
  return response.data;
};

/**
 * Actualiza los datos de un usuario.
 * @param {string} id - ID del usuario.
 * @param {UpdateUserDto} payload - Datos a actualizar.
 * @returns {Promise<any>} Respuesta del servidor.
 */
export const updateUser = async (id: string, payload: UpdateUserDto) => {
  const response = await axiosInstance.patch(API_USERS_GROUP.updateUser(id), payload);
  return response.data;
};

/**
 * Elimina un usuario.
 * @param {string} id - ID del usuario.
 * @returns {Promise<any>} Respuesta del servidor.
 */
export const deleteUser = async (id: string) => {
  const response = await axiosInstance.patch(API_USERS_GROUP.deleteUser(id));
  return response.data;
};

/**
 * Restaura un usuario eliminado.
 * @param {string} id - ID del usuario.
 * @returns {Promise<any>} Respuesta del servidor.
 */
export const restoreUser = async (id: string) => {
  const response = await axiosInstance.patch(API_USERS_GROUP.restoreUser(id));
  return response.data;
};

/**
 * 📸 Sube o actualiza el avatar de un usuario.
 * @param {string} id - ID del usuario.
 * @param {FormData} formData - Imagen enviada desde el frontend.
 * @returns {Promise<any>} Usuario actualizado con la nueva imagen.
 */
export const uploadUserAvatar = async (id: string, formData: FormData) => {
  const response = await axiosInstance.post(`${API_USERS_GROUP.base}/${id}/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
