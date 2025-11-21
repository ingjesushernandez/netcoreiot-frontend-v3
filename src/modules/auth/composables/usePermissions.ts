export default function () {
  const authStore = useAuthStore();

  const perms = computed(() => (authStore.userPermissions ?? []).map((p) => p.trim().toLowerCase()));

  const can = (key: string) => {
    const k = key.trim().toLowerCase();
    return perms.value.includes("*") || perms.value.includes(k);
  };

  const canAny = (keys: string[]) => {
    const ks = keys.map((k) => k.trim().toLowerCase());
    if (perms.value.includes("*")) return true;
    return ks.some((k) => perms.value.includes(k));
  };

  const canAll = (keys: string[]) => {
    const ks = keys.map((k) => k.trim().toLowerCase());
    if (perms.value.includes("*")) return true;
    return ks.every((k) => perms.value.includes(k));
  };

  return { can, canAny, canAll };
}
