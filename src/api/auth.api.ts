import type { IAuthDto, ILoggedUser } from "../modules/auth/interfaces";

export const authAxios = () => {
  const { $api } = useNuxtApp();
  return {
    getMe: () => $api.get<ILoggedUser>("/auth/me"),
    login: (payload: IAuthDto) => $api.post("/auth/login", payload),
    refresh: () => $api.post("/auth/refresh"),
    logout: () => $api.post("/auth/logout"),
    verifyEmail: (payload: IAuthDto) => $api.post("/auth/verify-email", payload),
    forgotPassword: (payload: IAuthDto) => $api.post("/auth/forgot-password", payload),
    verifyToken: (payload: IAuthDto) => $api.post("/auth/verify-token", payload),
    resetPassword: (payload: IAuthDto) => $api.post("/auth/reset-password", payload),
  };
};
