import useVuelidate from "@vuelidate/core";
import { required, helpers, minLength, maxLength } from "@vuelidate/validators";

import { rolesAxios } from "~/api/roles.api";

const emptyForm = (): ICreateRole => ({
  key: "",
  name: "",
  description: "",
  permissions: [],
});

export default function () {
  const api = rolesAxios();
  const store = useRolesStore();

  const { search, serverOptions, setSelectFields, setDateRange, onUpdateServerOptions, fetchList } = useListController({
    fetcher: async (q) => {
      const { data } = await api.findAll(q);
      return { items: data.data ?? [], total: data.total ?? 0 };
    },
    setList: (list, total) => store.setList(list, total),
    loadingRef: toRef(store, "loading"),
  });

  const roles = computed(() => store.roles);
  const totalItems = computed(() => store.total);
  const loading = computed(() => store.loading);

  // ---- UI / Modal
  const modalOpen = ref(false);
  const isEdit = ref(false);
  const submitting = ref(false);
  const title = computed(() => (isEdit.value ? "Editar rol" : "Nuevo rol"));

  // ---- Permissions
  const permissions = ref<IPermissions[]>([]);
  const loadingPerms = ref(false);
  const loadPermissions = async () => {
    if (permissions.value.length) return; // cache simple
    try {
      loadingPerms.value = true;
      const { data } = await api.getPermissions();
      permissions.value = data.data ?? [];
    } catch (err: any) {
      notifyApiError(err, "No fue posible cargar el catálogo de permisos");
    } finally {
      loadingPerms.value = false;
    }
  };

  // ---- Form ----
  const form = ref<ICreateRole>(emptyForm());
  const keySlug = helpers.regex(/^[a-z0-9_-]{3,40}$/);
  const rules = computed(() => ({
    key: { required, minLength: minLength(3), maxLength: maxLength(40), keySlug },
    name: { required, minLength: minLength(3), maxLength: maxLength(60) },
    permissions: {
      required: helpers.withMessage("Selecciona al menos un permiso.", (v: any[]) => Array.isArray(v) && v.length > 0),
    },
  }));
  const v$ = useVuelidate(rules, form);

  // ---- Select Permission
  const hasPerm = (k: string) => form.value.permissions.includes(k);
  const togglePerm = (k: string, checked: boolean) => {
    const set = new Set(form.value.permissions);
    checked ? set.add(k) : set.delete(k);
    form.value.permissions = Array.from(set);
  };
  const permissionAllChecked = (domain: IPermissions) => domain.items.every((it) => hasPerm(it.key));
  const togglePermissionAll = (domain: IPermissions, checked: boolean) => {
    const set = new Set(form.value.permissions);
    for (const it of domain.items) checked ? set.add(it.key) : set.delete(it.key);
    form.value.permissions = Array.from(set);
  };

  const readOnly = computed(() => isEdit.value && !!form.value.isSystem);

  // ---- Open / Closed ----
  const openNew = async () => {
    isEdit.value = false;
    form.value = emptyForm();
    await loadPermissions();
    modalOpen.value = true;
  };

  const openEdit = async (id: string) => {
    try {
      isEdit.value = true;
      await loadPermissions();
      const { data } = await api.findById(id);
      const r = data.data as ICreateRole;
      form.value = {
        _id: r._id,
        key: r.key,
        name: r.name,
        description: r.description ?? "",
        permissions: r.permissions ?? [],
        isSystem: r.isSystem ?? false,
      };
      modalOpen.value = true;
    } catch (err: any) {
      notifyApiError(err, "No fue posible cargar el rol");
    }
  };

  const closeModal = () => {
    modalOpen.value = false;
    nextTick(() => (form.value = emptyForm()));
    v$.value.$reset();
  };

  // ---- Actions
  const handleSubmit = async () => {
    await v$.value.$validate();
    if (v$.value.$invalid) return;

    try {
      submitting.value = true;
      if (isEdit.value && form.value._id) {
        if (form.value.isSystem) {
          notifyApiError(null as any, "Este rol de sistema no se puede editar.");
          return;
        }
        const { _id, ...payload } = form.value;
        const { data } = await api.update(_id, payload);
        if (data.message === "ROLE_UPDATED") {
          notifyApiSuccess("Rol actualizado correctamente.");
        }
      } else {
        const { _id, isSystem, ...payload } = form.value as any;
        const { data } = await api.create(payload);
        if (data.message === "ROLE_CREATED") {
          notifyApiSuccess("Rol creado correctamente.");
        }
      }
      closeModal();
      await fetchList();
    } catch (err: any) {
      notifyApiError(err, "No fue posible guardar el rol");
    } finally {
      submitting.value = false;
    }
  };

  const handleDelete = async (id: string, isSystem: boolean) => {
    if (isSystem) {
      notifyApiError(null as any, "No puedes eliminar un rol del sistema.");
      return;
    }

    const Swal = (await import("sweetalert2")).default;
    const res = await Swal.fire({
      title: "¿Eliminar rol?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!res.isConfirmed) return;

    try {
      const { data } = await api.delete(id);
      if (data.message === "ROLE_DELETED") {
        notifyApiSuccess("Rol eliminado correctamente.");
        await fetchList();
      }
    } catch (err: any) {
      notifyApiError(err);
    }
  };

  watchEffect(() => {
    if (!isEdit.value) {
      if (!form.value.key && form.value.name) {
        form.value.key = form.value.name
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9_-]/g, "");
      }
    }
  });

  return {
    // Modal/UI
    modalOpen,
    isEdit,
    title,
    submitting,
    readOnly,

    // Catálogo
    permissions,
    loadingPerms,
    loadPermissions,
    permissionAllChecked,
    togglePermissionAll,

    // Form
    form,
    v$,
    hasPerm,
    togglePerm,

    // Table
    roles,
    totalItems,
    loading,
    search,
    serverOptions,
    setSelectFields,
    setDateRange,
    onUpdateServerOptions,
    fetchList,

    // Actions
    openNew,
    openEdit,
    closeModal,
    handleSubmit,
    handleDelete,
  };
}
