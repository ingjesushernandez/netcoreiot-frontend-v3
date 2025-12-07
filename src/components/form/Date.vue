<script setup lang="ts">
/**
 * Componente de fecha (solo día) con Bootstrap 5.
 * - v-model: string | null | undefined (formato YYYY-MM-DD)
 * - Muestra label, requiredMark, hint, y errores usando vField (Vuelidate).
 * - Soporta min / max (YYYY-MM-DD).
 */

interface Props {
  id: string;
  label?: string;
  modelValue: string | null | undefined;
  placeholder?: string;
  disabled?: boolean;
  requiredMark?: boolean;
  hint?: string;
  vField?: any;
  messages?: Record<string, string>;
  min?: string; // "YYYY-MM-DD"
  max?: string; // "YYYY-MM-DD"
  clearable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  requiredMark: false,
  clearable: true,
});

const emit = defineEmits<{ (e: "update:modelValue", v: string | null): void }>();

const invalid = computed(() => Boolean(props.vField?.$error));

/** Normaliza el v-model al value del input date y viceversa */
const inputValue = computed({
  get: () => props.modelValue ?? "",
  set: (v: string) => {
    // Si viene vacío, emitir null para limpiar el modelo
    const val = v && v.trim().length ? v : null;
    emit("update:modelValue", val);
  },
});

const onInput = (e: Event) => {
  inputValue.value = (e.target as HTMLInputElement).value;
};

const clear = () => {
  if (props.disabled) return;
  emit("update:modelValue", null);
};
</script>

<template>
  <div class="form-group">
    <label :for="id" class="form-label">
      {{ label }}
      <span v-if="requiredMark" class="txt-danger" aria-hidden="true">*</span>
    </label>

    <div class="input-group">
      <input
        :id="id"
        type="date"
        class="form-control"
        :class="{ 'is-invalid': invalid }"
        :disabled="disabled"
        :placeholder="placeholder || 'Selecciona una fecha'"
        :value="inputValue"
        :min="min"
        :max="max"
        @input="onInput"
      />

      <!-- <button
        v-if="clearable"
        class="btn btn-outline-secondary"
        type="button"
        :title="'Limpiar fecha'"
        :aria-label="'Limpiar fecha'"
        :disabled="disabled || !inputValue"
        @click="clear"
      >
        ×
      </button> -->
    </div>

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
