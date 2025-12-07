import type { IPaged, IParams } from "~/api/api.interfaces";
import type { ICreateTemplate, ITemplate } from "~/modules/templates/interfaces";

export const templatesAxios = () => {
  const { $api } = useNuxtApp();

  return {
    create: (payload: ICreateTemplate) => $api.post<IPaged<null>>("/templates", payload),

    findAll: (params?: IParams) => $api.get<IPaged<ITemplate[]>>("/templates", { params }),

    findById: (id: string, select?: string) => $api.get<IPaged<ITemplate>>(`/templates/${id}`, { params: { select } }),

    update: (id: string, payload: Partial<ICreateTemplate>) => $api.patch<IPaged<null>>(`/templates/${id}`, payload),

    delete: (id: string) => $api.delete<IPaged<null>>(`/templates/${id}`),
  };
};
