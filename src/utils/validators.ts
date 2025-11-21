import { helpers } from "@vuelidate/validators";

// +<código país><9+ dígitos>  (ej: +57xxxxxxxxx)
export const phoneRegex = helpers.regex(/^\+\d{1,3}\d{9,}$/);

export const passwordPolicy = helpers.withMessage(
  "La contraseña debe tener 8+ caracteres, mayúscula, minúscula y número.",
  (value: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(String(value ?? ""))
);
