<script setup lang="ts">
interface Props {
  id: string;
  label?: string;
  type?: string;
  modelValue: string | number | null | undefined;
  placeholder?: string;
  min?: string;
  max?: string;
  autocomplete?: string;
  disabled?: boolean;
  requiredMark?: boolean;
  hint?: string;
  vField?: any;
  inputClass?: string;
  affixPadding?: boolean;
  messages?: Record<string, string>;
  inputmode?: "text" | "email" | "numeric" | "decimal" | "tel" | "url" | "search";
  autocapitalize?: "off" | "none" | "sentences" | "words" | "characters";
  spellcheck?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  disabled: false,
  requiredMark: false,
  affixPadding: true,
  autocapitalize: "none",
  spellcheck: false,
});

// --- Mapeo de mensajes ---
const DEFAULT_MESSAGES: Record<string, string> = {
  required: "Este campo es requerido.",
  email: "Formato de correo inválido.",
  minLength: "Longitud mínima no válida.",
  maxLength: "Longitud máxima no válida.",
  sameAs: "Los valores no coinciden.",
  sameAsPassword: "Las contraseñas no coinciden.",
  passwordPolicy: "La contraseña debe tener 8+ caracteres, mayúscula, minúscula y número.",
  phoneRegex: "Formato esperado: +<código><número>",
};

const emit = defineEmits<{ (e: "update:modelValue", v: string | number): void }>();
const slots = useSlots();
const invalid = computed(() => Boolean(props.vField?.$error));

const resolveErrorMessage = (): string | undefined => {
  const first = props.vField?.$errors?.[0];
  if (!first) return undefined;

  const validatorName: string | undefined = first.$validator;
  const params = first.$params || {};

  // 1) Si el usuario pasó un override por prop.messages
  if (validatorName && props.messages?.[validatorName]) {
    return props.messages[validatorName];
  }

  // 2) Mensajes estándar
  if (validatorName === "minLength") {
    const min = params?.min ?? props.vField?.minLength?.$params?.min;
    return min ? `Debe tener mínimo ${min} caracteres.` : DEFAULT_MESSAGES.minLength;
  }

  if (validatorName === "maxLength") {
    const max = params?.max ?? props.vField?.maxLength?.$params?.max;
    return max ? `Debe tener máximo ${max} caracteres.` : DEFAULT_MESSAGES.maxLength;
  }

  if (validatorName && DEFAULT_MESSAGES[validatorName]) {
    return DEFAULT_MESSAGES[validatorName];
  }

  // 3) Si el validador tenía $message (por helpers.withMessage), úsalo
  if (first.$message) return String(first.$message);

  return "Valor inválido.";
};

const msg = computed(resolveErrorMessage);

const onInput = (e: Event) => emit("update:modelValue", (e.target as HTMLSelectElement).value);
</script>

<template>
  <div class="form-group">
    <label v-if="label" class="form-label" :for="id">
      {{ label }} <span v-if="requiredMark" class="txt-danger" aria-hidden="true">*</span>
    </label>

    <div :class="[{ 'position-relative': slots.prefix || slots.suffix }]">
      <slot name="prefix" />

      <input
        :id="id"
        class="form-control"
        :class="[{ 'is-invalid': invalid, 'pe-5': affixPadding && (slots.prefix || slots.suffix) }, inputClass]"
        :type="type"
        :placeholder="placeholder"
        :min="min"
        :max="max"
        :autocomplete="autocomplete"
        :disabled="disabled"
        :aria-invalid="invalid ? 'true' : 'false'"
        :aria-describedby="[hint ? `${id}-hint` : null, invalid ? `${id}-error` : null].filter(Boolean).join(' ')"
        :value="modelValue"
        :inputmode="inputmode"
        :autocapitalize="autocapitalize"
        :spellcheck="spellcheck"
        @input="onInput"
      />

      <div
        v-if="slots.suffix"
        :class="['position-absolute end-0 translate-middle-y', invalid ? 'top-25 pe-4' : 'top-50 pe-3']"
        style="line-height: 0"
      >
        <slot name="suffix" />
      </div>

      <div v-if="hint" class="form-text mt-1" :id="`${id}-hint`">{{ hint }}</div>

      <div v-if="invalid" class="invalid-feedback d-block" :id="`${id}-error`">
        {{ msg }}
      </div>
    </div>
  </div>
</template>
