import { usersAxios } from "~/api/users.api";

export default function () {
  const router = useRouter();
  const api = usersAxios();
  const store = useUsersStore();

  const { search, serverOptions, rowLoading, setSelectFields, setDateRange, onUpdateServerOptions, fetchList } =
    useListController<IUser>({
      fetcher: async (q) => {
        const { data } = await api.findAll(q);
        return { items: data.data ?? [], total: data.total ?? 0 };
      },
      setList: (list, total) => store.setList(list, total),
      loadingRef: toRef(store, "loading"),
    });

  const users = computed(() => store.users);
  const totalItems = computed(() => store.total);
  const loading = computed(() => store.loading);

  const findLocal = (id: string) => users.value.find((u) => u._id === id);

  const handleDelete = async (id: string) => {
    const u = findLocal(id);
    if (isProtectedUser(u?.role)) {
      notifyApiError(null as any, "No puedes eliminar al superadmin.");
      return;
    }

    const Swal = (await import("sweetalert2")).default;
    const res = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!res.isConfirmed) return;

    try {
      const { data } = await api.delete(id);
      if (data.message === "USER_DELETED") {
        notifyApiSuccess("Usuario eliminado correctamente.");
        await fetchList();
      }
    } catch (err: any) {
      notifyApiError(err);
    }
  };

  const handleEnable = async (id: string, next: boolean) => {
    const u = findLocal(id);
    if (isProtectedUser(u?.role)) {
      notifyApiError(null as any, "No puedes cambiar el estado del superadmin.");
      return;
    }

    try {
      rowLoading.value[id] = true;
      const local = findLocal(id);
      if (local) local.isActive = next;

      const { data } = await api.enableUser(id, { isActive: next });

      if (data.message === "USER_STATUS_CHANGE") {
        notifyApiSuccess(next ? "Usuario activado." : "Usuario desactivado.");
      }
    } catch (err: any) {
      const local = findLocal(id);
      if (local) local.isActive = !next;
      notifyApiError(err, "No fue posible actualizar el estado");
    } finally {
      rowLoading.value[id] = false;
    }
  };

  const goNew = () => router.push({ name: "users-new" });
  const goView = (id: string) => router.push({ name: "users-id", params: { id } });
  const goEdit = (id: string) => router.push({ name: "users-edit", params: { id } });

  return {
    // State
    users,
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
    handleEnable,
    goNew,
    goView,
    goEdit,
  };
}
