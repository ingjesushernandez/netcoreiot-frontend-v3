import type { IPaged, IParams } from "~/api/api.interfaces";

export const devicesAxios = () => {
  const { $api } = useNuxtApp();

  return {
    create: (payload: ICreateDevice) => $api.post<IPaged<null>>("/devices", payload),

    findAll: (params?: IParams) => $api.get<IPaged<IDevice[]>>("/devices", { params }),

    findById: (id: string, select?: string) => $api.get<IPaged<IDevice>>(`/devices/${id}`, { params: { select } }),

    update: (id: string, payload: Partial<ICreateDevice>) => $api.patch<IPaged<null>>(`/devices/${id}`, payload),

    delete: (id: string) => $api.delete<IPaged<null>>(`/devices/${id}`),

    selectDevice: (id: string) => $api.patch<IPaged<IDevice>>(`/devices/select-device/${id}`),
  };
};
