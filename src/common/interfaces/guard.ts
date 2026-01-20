import { statusMessage } from "./statusMesage";


export type ErrorResponse =
  | { type: statusMessage.ERROR; message: string }
  | { type: statusMessage.INVALID; message: string }
  | { type: statusMessage.UNAUTHORIZED; message: string }
  | { type: statusMessage.WARNING; message: string };

export function isTypeResponse(response: unknown): response is ErrorResponse {
  if (typeof response !== "object" || response === null || !("type" in response)) {
    return false;
  }

  const { type } = response as { type: statusMessage };
  return Object.values(statusMessage).includes(type);
}
