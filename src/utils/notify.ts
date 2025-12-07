import { useToast } from "vue-toastification";

interface IApiError {
  response?: { data?: { message?: string | string[] } };
}

export const MSG: Record<string, string> = {
  // Success
  TOKEN_SEND_FORGOT: "Enviamos un correo con instrucciones para restablecer tu contraseña.",
  PASSWORD_UPDATED: "La contraseña fue actualizada con éxito.",
  USER_LOGOUT: "Gracias, nos vemos pronto...",
  VERIFIED_EMAIL: "Gracias, tu cuenta ha sido verificada con éxito.",

  // Error
  USER_NOT_FOUND: "El usuario no se encuentra registrado.",
  INVALID_CREDENTIALS: "Credenciales inválidas.",
  USER_UNVERIFIED: "Tu cuenta aún no ha sido verificada.",
  USER_INACTIVE: "Tu cuenta está suspendida.",
  EMAIL_NOT_SEND: "No fue posible enviar el correo.",
  TOKEN_NOT_VALID: "El token no es válido.",
  TOKEN_EXPIRED: "El token ha expirado.",
  USER_NOT_DELETED: "El usuario no se elimino.",
  ROLE_NOT_CREATED: "No fue posible crear el rol.",
  ROLE_NOT_UPDATED: "No fue posible actualizar el rol.",
  ROLE_NOT_FOUND: "El rol no se encuentra registrado.",
  ROLE_IN_USE: "El rol se encuentra en uso.",
  TEMPLATE_IN_USE: "El template se encuentra en uso.",
  TEMPLATE_NOT_FOUND: "El template no se encuentra registrado.",
  DEVICE_NOT_FOUND: "El dispositivo no se encuentra registrado.",
  SERIAL_EXISTS: "El serial ya se encuentra registrado.",
  ALARM_NOT_FOUND: "La alarma no se encuentra registrada.",
};

type ToastKind = "success" | "error";
const toast = useToast();

const extractApiMessage = (err?: IApiError): string | undefined => {
  const raw = err?.response?.data?.message;
  return Array.isArray(raw) ? raw[0] : raw;
};

const resolveMessage = (codeOrText?: string, fallback?: string): string => {
  if (!codeOrText) return fallback ?? "Ocurrió un error inesperado";
  return MSG[codeOrText] ?? codeOrText ?? fallback ?? "Ocurrió un error inesperado";
};

// Notificación DEFAULT
const notify = (kind: ToastKind, text: string, opts?: any) => {
  toast[kind](text, { timeout: 3500, position: "top-right", ...opts });
};

// Notificación ERROR
export const notifyApiError = (input?: IApiError | string, fallback = "Ocurrió un error inesperado", opts?: any) => {
  const codeOrText = typeof input === "string" ? input : extractApiMessage(input);
  notify("error", resolveMessage(codeOrText, fallback), opts);
};

// Notificación SUCCESS
export const notifyApiSuccess = (codeOrText?: string, fallback = "Operación exitosa", opts?: any) => {
  notify("success", resolveMessage(codeOrText, fallback), opts);
};
