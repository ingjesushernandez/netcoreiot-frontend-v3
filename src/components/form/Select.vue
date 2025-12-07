<script setup lang="ts">
interface Option {
  value: string | number;
  label: string;
}

type ValueLike = string | number | null | undefined;

interface Props {
  id: string;
  label?: string;
  modelValue: ValueLike;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  requiredMark?: boolean;
  hint?: string;
  vField?: any;
  messages?: Record<string, string>;
  emptyText?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  maxVisibleItems?: number;
  listboxWhenMany?: boolean;
  optionValueType?: "string" | "number";
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  requiredMark: false,
  emptyText: "Lista vacía",
  searchable: false,
  searchPlaceholder: "Buscar...",
  maxVisibleItems: 10,
  listboxWhenMany: false,
  optionValueType: "string",
});

const emit = defineEmits<{ (e: "update:modelValue", v: string | number | null): void }>();
const invalid = computed(() => Boolean(props.vField?.$error));

// --- búsqueda local
const query = ref("");
const normalizedQuery = computed(() => query.value.trim().toLowerCase());

const filteredOptions = computed<Option[]>(() => {
  if (!props.searchable || !normalizedQuery.value) return props.options;
  return props.options.filter(
    (o) =>
      String(o.label).toLowerCase().includes(normalizedQuery.value) ||
      String(o.value).toLowerCase().includes(normalizedQuery.value)
  );
});

const hasValue = computed(() => props.modelValue !== null && props.modelValue !== undefined && props.modelValue !== "");
const useListbox = computed(() => props.listboxWhenMany && filteredOptions.value.length > props.maxVisibleItems);

const coerce = (raw: string): string | number | null => {
  if (raw === "") return null;
  if (props.optionValueType === "number") {
    const n = Number(raw);
    return Number.isFinite(n) ? n : (raw as unknown as number); // fallback
  }
  return raw;
};

const onChange = (e: Event) => {
  const val = (e.target as HTMLSelectElement).value;
  emit("update:modelValue", coerce(val));
};

const ariaInvalid = computed(() => (invalid.value ? "true" : undefined));
const isEmpty = computed(() => filteredOptions.value.length === 0);
</script>

<template>
  <div class="form-group">
    <label :for="id" class="form-label">
      {{ label }}
      <span v-if="requiredMark" class="txt-danger" aria-hidden="true">*</span>
    </label>

    <!-- Buscador opcional -->
    <div v-if="searchable" class="mb-2">
      <input
        :id="`${id}-search`"
        type="text"
        class="form-control form-control-sm"
        :placeholder="searchPlaceholder"
        :disabled="disabled || options.length === 0"
        v-model="query"
        autocomplete="off"
      />
    </div>

    <select
      :id="id"
      class="form-select"
      :class="{ 'is-invalid': invalid }"
      :disabled="disabled || options.length === 0"
      :value="(modelValue ?? '') as any"
      :aria-invalid="ariaInvalid"
      :size="useListbox ? Math.min(filteredOptions.length + (hasValue ? 0 : 1), maxVisibleItems) : undefined"
      @change="onChange"
    >
      <!-- Placeholder solo cuando no hay valor seleccionado -->
      <option v-if="!hasValue" disabled value="" hidden>
        {{ placeholder || "Selecciona una opción" }}
      </option>

      <!-- Estado de lista vacía -->
      <option v-if="isEmpty" disabled value="">
        {{ emptyText }}
      </option>

      <!-- Opciones filtradas -->
      <option v-for="opt in filteredOptions" :key="opt.value" :value="opt.value">
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

<style scoped>
select[size] {
  max-height: 240px;
  overflow-y: auto;
}
</style>
