import axiosInstance from "@/common/utils/axios";
import { API_ROLES_GROUP } from "./APIs";
import { CreateRole, UpdateRole } from "../types/roleDto";

export const createRole = async (payload: CreateRole) => {
    return await axiosInstance.post(API_ROLES_GROUP.createRole, payload).then( res => res.data );
};

export const findAllRoles = async () => {
    return await axiosInstance.get(API_ROLES_GROUP.findAll).then( res => res.data );
};

export const updateRole = async (id: string, payload: UpdateRole) => {
    return await axiosInstance.put(API_ROLES_GROUP.updateRole(id), payload).then( res => res.data );
};

export const deleteRole = async (id: string) => {
    return await axiosInstance.delete(API_ROLES_GROUP.deleteRole(id)).then( res => res.data );
};

