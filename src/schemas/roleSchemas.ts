import z from "zod";

export const createRole = z.object({
  description: z.string().min(3, "La descripción debe tener al menos 3 caracteres"),
});

export const updateRole = createRole;