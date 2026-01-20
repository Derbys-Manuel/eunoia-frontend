export interface AuthResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
