import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { useAuthStore } from "~/modules/auth/stores/auth";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const api: AxiosInstance = axios.create({
    baseURL: config.public.apiUri,
    withCredentials: true,
  });

  api.interceptors.request.use((cfg) => {
    const auth = useAuthStore();
    const isApi = (cfg.baseURL ?? "").startsWith(config.public.apiUri ?? "");
    if (isApi && auth.accessToken) {
      cfg.headers = cfg.headers ?? {};
      cfg.headers.Authorization = `Bearer ${auth.accessToken}`;
    }
    return cfg;
  });

  let isRefreshing = false;
  let queue: Array<[(v?: unknown) => void, (r?: any) => void]> = [];

  const processQueue = (error: any, token: string | null = null) => {
    queue.forEach(([resolve, reject]) =>
      error ? reject(error) : resolve(token)
    );
    queue = [];
  };

  const AUTH_BYPASS = ["/auth/login", "/auth/refresh", "/auth/logout"];

  api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const auth = useAuthStore();
      const original = error.config as
        | (AxiosRequestConfig & { _retry?: boolean })
        | undefined;
      const status = error.response?.status;

      // Filtros básicos
      if (!original || status !== 401 || original._retry)
        return Promise.reject(error);

      // Solo refresca si era contra tu API
      const isApi = (original.baseURL ?? "").startsWith(
        config.public.apiUri ?? ""
      );
      if (!isApi) return Promise.reject(error);

      // Ignorar endpoints de auth
      const relativeUrl = (original.url ?? "").replace(
        original.baseURL ?? "",
        ""
      );
      if (AUTH_BYPASS.some((p) => relativeUrl.includes(p)))
        return Promise.reject(error);

      // Si la original no llevaba Authorization, no es un AT expirado: no refrescar
      const hadAuthHeader = !!original.headers?.Authorization;
      if (!hadAuthHeader) return Promise.reject(error);

      // Orquestación de refresh
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push([resolve, reject]);
        }).then(() => {
          original.headers = original.headers ?? {};
          if (auth.accessToken)
            original.headers.Authorization = `Bearer ${auth.accessToken}`;
          return api(original);
        });
      }

      isRefreshing = true;
      try {
        await auth.refreshToken();
        processQueue(null, auth.accessToken);
        original.headers = original.headers ?? {};
        if (auth.accessToken)
          original.headers.Authorization = `Bearer ${auth.accessToken}`;
        return api(original);
      } catch (err) {
        processQueue(err, null);
        auth.resetLogout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
  );

  return { provide: { api } };
});
