<script setup lang="ts">
interface Props {
  value?: string | null;
  title?: string;
  successMsg?: string;
  errorMsg?: string;
  asLink?: boolean;
  size?: "sm" | "md";
  classIcon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: null,
  title: "Copiar",
  successMsg: "Copiado en el portapapeles.",
  errorMsg: "No se pudo copiar",
  asLink: true,
  size: "sm",
  classIcon: "txt-primary",
});

const copyRaw = async (text?: string | null) => {
  try {
    if (!text) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = String(text);
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
};

const handleCopy = async (e: MouseEvent) => {
  (e.currentTarget as HTMLButtonElement)?.blur?.();
  const ok = await copyRaw(props.value);
  if (ok) notifyApiSuccess(props.successMsg);
  else notifyApiError(props.errorMsg);
};
</script>

<template>
  <button
    type="button"
    :class="['btn', asLink ? 'btn-link' : 'btn-light', size === 'sm' ? 'p-0' : '']"
    :title="title"
    :aria-label="title"
    :disabled="!value"
    @click="handleCopy"
    @mouseup="(e)=> (e.currentTarget as HTMLButtonElement)?.blur()"
  >
    <small>
      <Icon :class="classIcon" name="fa6-regular:copy" />
    </small>
  </button>
</template>
