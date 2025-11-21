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
  name?: string;
  inline?: boolean;
  disabled?: boolean;
  requiredMark?: boolean;
  vField?: any;
  messages?: Record<string, string>;
}

const props = withDefaults(defineProps<Props>(), {
  inline: true,
  disabled: false,
  requiredMark: false,
});
const emit = defineEmits<{ (e: "update:modelValue", v: string): void }>();
const invalid = computed(() => props.vField?.$error);

const groupName = computed(() => props.name || props.id);
const onChange = (val: string) => emit("update:modelValue", val);
</script>

<template>
  <div class="form-group">
    <label v-if="label" class="form-label" :for="id">
      {{ label }} <span v-if="requiredMark" class="txt-danger" aria-hidden="true">*</span>
    </label>

    <div :class="inline ? 'd-flex flex-wrap gap-3 ' : 'd-flex flex-column'">
      <div v-for="(opt, idx) in options" :key="opt.value" class="form-check">
        <input
          class="form-check-input"
          type="radio"
          :id="`${id}-${idx}`"
          :name="groupName"
          :value="opt.value"
          :checked="modelValue === opt.value"
          :disabled="disabled"
          @change="onChange(opt.value)"
        />
        <label class="form-check-label" :for="`${id}-${idx}`">{{ opt.label }}</label>
      </div>
    </div>

    <div v-if="invalid" class="invalid-feedback d-block">
      <span v-if="vField?.required?.$invalid">
        {{ messages?.required ?? "Este campo es requerido." }}
      </span>
      <span v-else>
        {{ messages?.default ?? "Valor inválido." }}
      </span>
    </div>
  </div>
</template>
