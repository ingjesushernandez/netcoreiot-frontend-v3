<script setup lang="ts">
type Variant = "solid" | "outline" | "link";
type Color = "primary" | "secondary" | "success" | "info" | "warning" | "danger" | "dark" | "light";
type Size = "sm" | "md" | "lg";
type Mode = "any" | "all";

interface Props {
  // Contenido/UX
  label?: string;
  icon?: string;
  iconOnly?: boolean;
  title?: string;
  ariaLabel?: string;

  // Comportamiento
  type?: "button" | "submit";

  // Estilo
  variant?: Variant;
  color?: Color;
  size?: Size;
  block?: boolean;
  rounded?: boolean;
  iconClass?: string;

  // Estado
  disabled?: boolean;
  loading?: boolean;

  // Permisos
  perms?: string[];
  mode?: Mode;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "solid",
  color: "primary",
  size: "md",
  type: "button",
  block: false,
  rounded: false,
  iconOnly: false,
  mode: "any",
  disabled: false,
  loading: false,
});

const emit = defineEmits<{ (e: "click", ev: MouseEvent): void }>();

// Permisos
const { canAny, canAll } = usePermissions();
const allowed = computed(() => {
  if (!props.perms?.length) return true;
  return props.mode === "all" ? canAll(props.perms) : canAny(props.perms);
});

// Clases del botón
const btnClasses = computed(() => {
  const base = ["btn"];
  if (props.variant === "link") base.push("btn-link");
  else if (props.variant === "outline") base.push(`btn-outline-${props.color}`);
  else base.push(`btn-${props.color}`);

  if (props.size === "sm") base.push("btn-sm");
  if (props.size === "lg") base.push("btn-lg");
  if (props.block) base.push("w-100");
  if (props.rounded) base.push("rounded-pill");
  return base.join(" ");
});

// Accesibilidad
const computedAriaLabel = computed(() => {
  if (props.ariaLabel) return props.ariaLabel;
  if (props.iconOnly) return props.title || "Botón";
  return undefined;
});

const blur = (e: MouseEvent) => (e.currentTarget as HTMLButtonElement)?.blur();

const onClick = (e: MouseEvent) => {
  if (!allowed.value || props.disabled || props.loading) return;
  emit("click", e);
};
</script>

<template>
  <button
    v-if="allowed"
    :type="type"
    :class="btnClasses"
    :title="title"
    :aria-label="computedAriaLabel"
    :disabled="disabled || loading"
    @click="onClick"
    @mouseup="blur"
  >
    <span v-if="loading" class="spinner-border spinner-border-sm me-2" />
    <Icon v-if="icon" :name="icon" :class="[iconOnly ? '' : 'me-2', iconClass]" />
    <span v-if="!iconOnly && label">{{ label }}</span>
  </button>
</template>
