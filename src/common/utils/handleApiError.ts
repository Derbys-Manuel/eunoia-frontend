type ApiErrorShape = {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
};

export function parseApiError(
  error: unknown,
  fallbackMessage = "Ocurrio un error inesperado."
) {
  if (typeof error === "object" && error !== null) {
    const axiosError = error as ApiErrorShape;

    return (
      axiosError.response?.data?.message ||
      axiosError.message ||
      fallbackMessage
    );
  }

  return fallbackMessage;
}
