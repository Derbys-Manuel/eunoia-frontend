import { fullRegisterSchema, LoginSchema, RegisterSchema } from "../schemas/authSchemas";

export type LoginCredentials = z.infer<typeof LoginSchema>;
export type RegisterCredentials = z.infer<typeof RegisterSchema>;
export type fullRegisterCredentials = z.infer<typeof fullRegisterSchema>