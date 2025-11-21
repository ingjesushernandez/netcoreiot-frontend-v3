import { filesAxios } from "~/api/files.api";

export default function () {
  const filesApi = filesAxios();
  const authStore = useAuthStore();
  const uploading = ref(false);
  const deleting = ref(false);
  const fileInput = ref<HTMLInputElement | null>(null);
  const previewUrl = ref<string | null>(null);
  const user = computed(() => authStore.loggedUser);

  const {
    public: { apiUri },
  } = useRuntimeConfig();

  const currentSrc = computed(() => (user.value?.avatar ? `${apiUri}/files/avatar/${user.value.avatar}` : null));

  const openPicker = () => fileInput.value?.click();

  const validateFile = (file: File) => {
    const okType = /^image\/(png|jpeg|jpg|webp)$/i.test(file.type);
    const okSize = file.size <= 2 * 1024 * 1024;
    if (!okType) notifyApiError(null as any, "Formato inválido (PNG, JPG o WEBP).");
    if (!okSize) notifyApiError(null as any, "La imagen debe pesar ≤ 2MB.");
    return okType && okSize;
  };

  const onFileChange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file || !validateFile(file)) return;

    try {
      uploading.value = true;
      previewUrl.value = URL.createObjectURL(file);
      const { data } = await filesApi.uploadAvatar(file);
      if (data.message === "AVATAR_UPDATED") {
        const avatar = data.data.avatar;
        authStore.loggedUser = { ...(authStore.loggedUser as any), avatar };
        notifyApiSuccess("Avatar actualizado.");
      }
    } catch (err: any) {
      previewUrl.value = null;
      notifyApiError(err, "No fue posible actualizar tu avatar");
    } finally {
      uploading.value = false;
      setTimeout(() => {
        if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
      }, 0);
    }
  };

  const deleteAvatar = async () => {
    const Swal = (await import("sweetalert2")).default;
    const res = await Swal.fire({
      title: "¿Eliminar avatar?",
      text: "Se borrará la imagen del servidor y se limpiará tu perfil.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!res.isConfirmed) return;

    try {
      deleting.value = true;
      const { data } = await filesApi.deleteAvatar();
      if (data.message === "AVATAR_DELETED") {
        authStore.loggedUser = { ...(authStore.loggedUser as any), avatar: null };
        previewUrl.value = null;
        notifyApiSuccess("Avatar eliminado.");
      }
    } catch (err: any) {
      notifyApiError(err, "No fue posible eliminar el avatar");
    } finally {
      deleting.value = false;
    }
  };

  return {
    currentSrc,
    previewUrl,
    uploading,
    deleting,
    fileInput,
    openPicker,
    onFileChange,
    deleteAvatar,
  };
}
