import type { IParams } from "~/api/api.interfaces";
import type { ITemplate } from "../interfaces";
import { templatesAxios } from "~/api/templates.api";

export default function () {
  const router = useRouter();
  const api = templatesAxios();
  const store = useTemplatesStore();
  const authStore = useAuthStore();

  const isSuper = computed<boolean>(() => {
    const perms = authStore.userPermissions ?? [];
    return perms.includes("*");
  });

  const { search, serverOptions, rowLoading, setSelectFields, setDateRange, onUpdateServerOptions, fetchList } =
    useListController<ITemplate>({
      fetcher: async (q) => {
        const finalQuery: IParams & { user?: string } = { ...q };

        if (!isSuper.value) {
          const uid = authStore.loggedUserId ?? authStore.loggedUser?._id;
          if (uid) finalQuery.user = uid as string;
        }

        const { data } = await api.findAll(finalQuery);
        return { items: data.data ?? [], total: data.total ?? 0 };
      },
      setList: (list, total) => store.setList(list, total),
      loadingRef: toRef(store, "loading"),
    });

  const templates = computed(() => store.templates);
  const totalItems = computed(() => store.total);
  const loading = computed(() => store.loading);

  const handleDelete = async (id: string) => {
    const Swal = (await import("sweetalert2")).default;
    const res = await Swal.fire({
      title: "¿Eliminar template?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!res.isConfirmed) return;

    try {
      const { data } = await api.delete(id);
      if (data.message === "TEMPLATE_DELETED") {
        notifyApiSuccess("Template eliminado correctamente.");
        await fetchList();
      }
    } catch (err: any) {
      notifyApiError(err, "No fue posible eliminar el template");
    }
  };

  const goNew = () => router.push({ name: "templates-new" });
  const goView = (id: string) => router.push({ name: "templates-id", params: { id } });
  const goEdit = (id: string) => router.push({ name: "templates-edit", params: { id } });

  return {
    // State
    templates,
    totalItems,
    loading,
    search,
    serverOptions,
    setSelectFields,
    setDateRange,
    onUpdateServerOptions,
    fetchList,
    rowLoading,

    // Actions
    handleDelete,
    goNew,
    goView,
    goEdit,
  };
}
