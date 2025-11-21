import { usersAxios } from "~/api/users.api";

export default function () {
  const router = useRouter();
  const route = useRoute();
  const api = usersAxios();

  const id = computed(() => String(route.params.id || ""));

  // ---- State
  const loading = ref(false);
  const user = ref<any | null>(null);

  const load = async () => {
    if (!id.value) return router.push({ name: "users-index" });
    try {
      loading.value = true;
      const { data } = await api.findById(id.value);
      if (data.message === "USER_FOUND") {
        user.value = data.data;
      }
    } catch (err: any) {
      notifyApiError(err);
      await router.push({ name: "users-index" });
    } finally {
      loading.value = false;
    }
  };

  // Presentation
  const fullName = computed(() => {
    const fn = user.value?.firstName ?? "";
    const ln = user.value?.lastName ?? "";
    return [fn, ln].filter(Boolean).join(" ");
  });

  const roleName = computed(() => user.value?.role?.name ?? "—");
  const roleKey = computed(() => user.value?.role?.key ?? "—");
  const permsCount = computed(() => user.value?.role?.permissions?.length ?? 0);

  const createdAtFmt = computed(() => fmtDate(user.value?.createdAt));
  const updatedAtFmt = computed(() => fmtDate(user.value?.updatedAt));

  const goBack = () => router.push({ name: "users-index" });
  const goEdit = () => router.push({ name: "users-edit", params: { id: id.value } });

  return {
    // State
    loading,
    user,

    // Presentation
    fullName,
    roleName,
    roleKey,
    permsCount,
    createdAtFmt,
    updatedAtFmt,

    // Actions
    load,
    goBack,
    goEdit,
  };
}
