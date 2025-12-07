<script setup lang="ts">
const props = defineProps<{
  id?: string;
  label?: string;
  modelValue: string;
  disabled?: boolean;
  icons?: string[];
  classIcon?: string;
}>();

const emit = defineEmits<{ (e: "update:modelValue", v: string): void }>();

const q = ref("");
const list = computed(() => (props.icons?.length ? props.icons : fa6SolidIcons));
const filtered = computed(() => {
  const term = q.value.trim().toLowerCase();
  if (!term) return list.value.slice(0, 200); // límite práctico
  return list.value.filter((n) => n.toLowerCase().includes(term)).slice(0, 200);
});

const pick = (name: string) => emit("update:modelValue", name);
</script>

<template>
  <div class="mb-2">
    <label v-if="label" class="form-label" :for="id">{{ label }}</label>

    <div class="input-group input-search-table mb-2">
      <span class="input-group-text"><Icon name="fa6-solid:magnifying-glass" /></span>
      <input
        type="search"
        class="form-control"
        :id="id"
        placeholder="Buscar icono (fa6-solid:...)"
        v-model.trim="q"
        :disabled="disabled"
      />
    </div>

    <div class="icon-grid">
      <button
        v-for="name in filtered"
        :key="name"
        type="button"
        class="icon-btn"
        :class="{ active: modelValue === name }"
        :title="name"
        :disabled="disabled"
        @click="pick(name)"
        @mouseup="(e)=> (e.currentTarget as HTMLButtonElement)?.blur()"
      >
        <Icon :class="`widget-${classIcon}`" :name="name" class="icon" />
        <span class="label">{{ name.replace("fa6-solid:", "") }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 0.5rem;
  max-height: 150px;
  overflow: auto;
  border: 1px solid var(--bs-border-color);
  border-radius: 0.5rem;
  padding: 0.5rem;
  background: var(--bs-body-bg);
}
.icon-btn {
  background: transparent;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  padding: 0.5rem 0.4rem;
  display: grid;
  grid-auto-rows: max-content;
  justify-items: center;
  row-gap: 0.35rem;
}
.icon-btn .icon {
  font-size: 20px;
}
.icon-btn .label {
  font-size: 11px;
  font-family: Rubik, sans-serif;
  color: #2f2f3b;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 100%;
}
.icon-btn:hover {
  border-color: var(--bs-border-color);
  background: var(--bs-tertiary-bg);
}
.icon-btn.active {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.15rem rgba(var(--bs-primary-rgb), 0.12);
}

body.dark-only .icon-grid {
  background: #1d1e26;
}

body.dark-only .icon-grid .icon-btn .label {
  color: #fff9;
}
</style>
