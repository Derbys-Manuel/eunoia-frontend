import { createUserSchema, updateUserSchema } from "@/schemas/userSchemas";

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;