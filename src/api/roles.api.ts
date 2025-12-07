import type { IParams, IPaged } from "./api.interfaces";

export const rolesAxios = () => {
  const { $api } = useNuxtApp();

  return {
    create: (payload: ICreateRole) => $api.post<IPaged<null>>("/roles", payload),

    findAll: (params?: IParams) => $api.get<IPaged<IRole[]>>("/roles", { params }),

    findById: (id: string, select?: string) => $api.get<IPaged<IRole>>(`/roles/${id}`, { params: { select } }),

    update: (id: string, payload: Partial<ICreateRole>) => $api.patch<IPaged<null>>(`/roles/${id}`, payload),

    delete: (id: string) => $api.delete<IPaged<null>>(`/roles/${id}`),

    getPermissions: () => $api.get<IPaged<IPermissions[]>>("/roles/permissions/catalog"),
  };
};
