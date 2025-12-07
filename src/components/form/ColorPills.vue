<script setup lang="ts">
const props = defineProps<{
  id?: string;
  label?: string;
  modelValue: ClassType;
  options?: { value: ClassType; label: string }[];
  disabled?: boolean;
}>();

const emit = defineEmits<{ (e: "update:modelValue", v: ClassType): void }>();

const opts = computed(
  () =>
    props.options ?? [
      { value: "primary", label: "Primario" },
      { value: "secondary", label: "Secundario" },
      { value: "info", label: "Información" },
      { value: "success", label: "Éxito" },
      { value: "warning", label: "Alerta" },
    ]
);

const pick = (v: any) => emit("update:modelValue", v);
</script>

<template>
  <div class="select-color mb-2">
    <label v-if="label" class="form-label" :for="id">{{ label }}</label>
    <div class="d-flex gap-2 flex-wrap">
      <button
        v-for="o in opts"
        :key="o.value"
        type="button"
        class="color-pill"
        :class="[`bg-${o.value}`, modelValue === o.value ? 'ring' : '']"
        :aria-pressed="modelValue === o.value"
        :disabled="disabled"
        @click="pick(o.value)"
        @mouseup="(e)=> (e.currentTarget as HTMLButtonElement)?.blur()"
      >
        <span class="dot" />
        <span class="label">{{ o.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.color-pill {
  border: none;
  border-radius: 9999px;
  padding: 0.35rem 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  opacity: 0.95;
}
.color-pill .dot {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.85);
}
.color-pill.ring {
  box-shadow: 0 0 0 2px #fff inset, 0 0 0 2px rgba(0, 0, 0, 0.2);
}

.select-color .bg-primary {
  background-color: var(--w-primary) !important;
}
.select-color .bg-secondary {
  background-color: var(--w-secondary) !important;
}
.select-color .bg-success {
  background-color: var(--w-success) !important;
}
.select-color .bg-warning {
  background-color: var(--w-warning) !important;
}
.select-color .bg-info {
  background-color: var(--w-info) !important;
}
</style>
