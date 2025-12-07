import { templatesAxios } from "~/api/templates.api";
import type { ITemplate } from "../interfaces";

export default function () {
  const router = useRouter();
  const route = useRoute();
  const api = templatesAxios();

  const id = computed(() => String(route.params.id || ""));
  const hasWidgets = computed(() => (template.value?.widgets?.length ?? 0) > 0);

  // ---- State
  const loading = ref(false);
  const template = ref<ITemplate | null>(null);

  const load = async () => {
    if (!id.value) return router.push({ name: "templates-index" });
    try {
      loading.value = true;
      const { data } = await api.findById(id.value);
      if (data.message === "TEMPLATE_FOUND") {
        template.value = data.data;
      }
    } catch (err: any) {
      notifyApiError(err);
      await router.push({ name: "templates-index" });
    } finally {
      loading.value = false;
    }
  };

  const goBack = () => router.push({ name: "templates-index" });
  const goEdit = () => router.push({ name: "templates-edit", params: { id: id.value } });

  return {
    // State
    loading,
    template,
    hasWidgets,

    // Actions
    load,
    goBack,
    goEdit,
  };
}
