<script setup lang="ts">
interface Option {
  value: string;
  label: string;
}

interface Props {
  id: string;
  label?: string;
  modelValue: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  requiredMark?: boolean;
  hint?: string;
  vField?: any;
  messages?: Record<string, string>;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  requiredMark: false,
});

const emit = defineEmits<{ (e: "update:modelValue", v: string): void }>();
const invalid = computed(() => Boolean(props.vField?.$error));

const onInput = (e: Event) => emit("update:modelValue", (e.target as HTMLSelectElement).value);
</script>

<template>
  <div class="form-group">
    <label :for="id" class="form-label">
      {{ label }}
      <span v-if="requiredMark" class="txt-danger" aria-hidden="true">*</span>
    </label>

    <select
      :id="id"
      class="form-select"
      :class="{ 'is-invalid': invalid }"
      :disabled="disabled"
      :value="modelValue"
      @change="onInput"
    >
      <option selected disabled value="" hidden>
        {{ placeholder || "Selecciona una opción" }}
      </option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>

    <div v-if="invalid" class="invalid-feedback" :id="`${id}-error`">
      <span v-if="vField?.required?.$invalid">
        {{ messages?.required ?? "Este campo es requerido." }}
      </span>
      <span v-else>
        {{ messages?.default ?? "Valor inválido." }}
      </span>
    </div>

    <small v-if="hint" class="form-text text-muted">{{ hint }}</small>
  </div>
</template>
