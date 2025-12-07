import type { ITemplate } from "../interfaces";

export const useTemplatesStore = defineStore("templates", () => {
  const templates = ref<ITemplate[]>([]);
  const total = ref(0);
  const loading = ref(false);

  const setList = (list: ITemplate[], t: number) => {
    templates.value = list;
    total.value = t;
  };

  return {
    templates,
    total,
    loading,
    setList,
  };
});
