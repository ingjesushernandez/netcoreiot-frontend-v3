import type { IRole } from "../interfaces";

export const useRolesStore = defineStore("roles", () => {
  const roles = ref<IRole[]>([]);
  const total = ref(0);
  const loading = ref(false);

  const byId = (id: string) => roles.value.find((r) => r._id === id) ?? null;

  const setList = (items: IRole[], t: number) => {
    roles.value = items;
    total.value = t;
  };

  return {
    roles,
    total,
    loading,
    byId,
    setList,
  };
});
