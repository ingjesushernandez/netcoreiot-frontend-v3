<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";

interface Props {
  modelValue: string;
  placeholder?: string;
  ariaLabel?: string;
  disabled?: boolean;
  debounce?: number;
}
const props = withDefaults(defineProps<Props>(), {
  placeholder: "Buscar…",
  ariaLabel: "Buscar",
  disabled: false,
  debounce: 300,
});

const emit = defineEmits<{ (e: "update:modelValue", v: string): void }>();

const onInput = useDebounceFn((e: Event) => {
  const v = (e.target as HTMLInputElement).value.trim();
  emit("update:modelValue", v);
}, props.debounce);
</script>

<template>
  <div class="input-group input-search-table">
    <span class="input-group-text" id="search-addon">
      <Icon name="fa6-solid:magnifying-glass" aria-hidden="true" />
    </span>
    <input
      type="search"
      class="form-control"
      :placeholder="placeholder"
      :aria-label="ariaLabel"
      aria-describedby="search-addon"
      :defaultValue="modelValue"
      :disabled="disabled"
      @input="onInput"
    />
  </div>
</template>
