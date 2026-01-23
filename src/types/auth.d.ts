import { z } from 'zod';
import { fullRegisterSchema, LoginSchema, RegisterSchema } from "../schemas/authSchemas";
import { createUserSchema} from "../schemas/userSchemas";

export type LoginCredentials = z.infer<typeof LoginSchema>;
export type RegisterCredentials = z.infer<typeof RegisterSchema>;
export type fullRegisterCredentials = z.infer<typeof fullRegisterSchema>
export type createUser = z.infer<typeof createUserSchema>;