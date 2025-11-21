import type { IParams, IPaged } from "./api.interfaces";
import type { IUser, ICreateUser, IUpdatePass, IEnable, IProfileForm } from "../modules/users/interfaces";

export const usersAxios = () => {
  const { $api } = useNuxtApp();
  return {
    create: (payload: ICreateUser) => $api.post<IPaged<null>>("/users", payload),

    findAll: (params?: IParams) => $api.get<IPaged<IUser[]>>("/users", { params }),

    findById: (id: string, select?: string) => $api.get<IPaged<IUser>>(`/users/${id}`, { params: { select } }),

    update: (id: string, payload: Partial<ICreateUser | IProfileForm>) =>
      $api.patch<IPaged<null>>(`/users/${id}`, payload),

    delete: (id: string) => $api.delete<IPaged<null>>(`/users/${id}`),

    restore: (id: string) => $api.patch<IPaged<null>>(`/users/restore-user/${id}`),

    updatePassword: (id: string, payload: IUpdatePass) =>
      $api.patch<IPaged<null>>(`/users/update-password/${id}`, payload),

    updateAvatar: (payload: { avatar: string }) => $api.patch<IPaged<null>>("/users/update-avatar", payload),

    enableUser: (id: string, payload: IEnable) => $api.patch<IPaged<null>>(`/users/enable-user/${id}`, payload),
  };
};
