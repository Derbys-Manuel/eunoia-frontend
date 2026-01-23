import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { UpdateUserDto } from "@/types/user";
import { findAllRoles } from "../../../services/roleService";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

interface User {
  id: string;
  name: string;
  email: string;
  deleted: boolean;
  avatarUrl: string;
  createdAt: string;
  role: {
    id: string;
    description: string;
  };
}

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormData) => void;
  formId?: string;
}

type UserFormData = UpdateUserDto & { avatarUrl?: string };

export const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, formId }) => {
  const [roles, setRoles] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      roleId: user?.role?.id || "",
      avatarUrl: user?.avatarUrl || "",
    },
  });

  const getRoles = async () => {
    try {
      const response = await findAllRoles();
      setRoles(response);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  const onSubmitForm = async (data: UserFormData) => {
    try {
      await onSubmit(data);
    } catch (error: any) {
      const message: string | undefined =
        error?.response?.data?.message || error?.message;
      if (!message) return;

      const parts = message.split(" | ");
      for (const part of parts) {
        const lower = part.toLowerCase();
        if (lower.includes("name")) {
          setError("name", { type: "server", message: part });
        } else if (lower.includes("email")) {
          setError("email", { type: "server", message: part });
        } else if (lower.includes("password")) {
          setError("password" as any, { type: "server", message: part });
        } else if (lower.includes("role")) {
          setError("roleId", { type: "server", message: part });
        }
      }
    }
  };

  return (
    <Box
      component="form"
      id={formId}
      onSubmit={handleSubmit(onSubmitForm)}
      sx={{ display: "grid", gap: 2 }}
    >
      <TextField
        label="Nombre"
        placeholder="Nombre completo"
        size="small"
        fullWidth
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
      />

      <TextField
        label="Correo Electrónico"
        placeholder="correo@edominio.com"
        type="email"
        size="small"
        fullWidth
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        label="Contraseña"
        placeholder="Contraseña"
        type="password"
        size="small"
        fullWidth
        {...register("password" as any)}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <FormControl size="small" fullWidth error={!!errors.roleId}>
        <InputLabel id="roleId-label">Rol</InputLabel>

        <Controller
          control={control}
          name="roleId"
          render={({ field }) => (
            <Select
              labelId="roleId-label"
              label="Rol"
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value)}
            >
              <MenuItem value="" disabled>
                Selecciona un rol
              </MenuItem>
              {roles.map((role: any) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.description}
                </MenuItem>
              ))}
            </Select>
          )}
        />

        {errors.roleId?.message ? (
          <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
            {errors.roleId.message}
          </Typography>
        ) : null}
      </FormControl>
    </Box>
  );
};
