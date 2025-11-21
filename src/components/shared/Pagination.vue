<script setup lang="ts">
interface Props {
  page: number;
  perPage: number;
  total: number;
  perPageOptions?: (number | "all")[];
  disabled?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  perPageOptions: () => [5, 10, 25, 50, "all"],
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:page", value: number): void;
  (e: "update:per-page", value: number): void;
}>();

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / Math.max(1, props.perPage))));

// Rango mostrado “Mostrando X–Y de Z”
const rangeStart = computed(() => (props.total === 0 ? 0 : (props.page - 1) * props.perPage + 1));
const rangeEnd = computed(() => Math.min(props.total, props.page * props.perPage));

// Genera arreglo con páginas y elipses
const pages = computed<(number | "...")[]>(() => {
  const tp = totalPages.value;
  const p = Math.min(Math.max(1, props.page), tp);
  if (tp <= 7) return Array.from({ length: tp }, (_, i) => i + 1);

  const out: (number | "...")[] = [1];
  const pushIf = (n: number) => {
    if (n > 1 && n < tp) out.push(n);
  };

  // left ellipsis
  if (p > 4) out.push("...");
  // middle block
  pushIf(p - 1);
  pushIf(p);
  pushIf(p + 1);
  // right ellipsis
  if (p < tp - 3) out.push("...");
  // last
  out.push(tp);

  // quita duplicados / ordena
  return out;
});

const go = (n: number) => {
  if (props.disabled) return;
  const tp = totalPages.value;
  const next = Math.min(Math.max(1, n), tp);
  if (next !== props.page) emit("update:page", next);
};
const prev = () => go(props.page - 1);
const next = () => go(props.page + 1);

const onChangePerPage = (e: Event) => {
  const raw = (e.target as HTMLSelectElement).value;
  const val = raw === "all" ? Math.max(1, props.total) : Number(raw);
  emit("update:per-page", val);
};
</script>

<template>
  <div class="pagination-container gap-3 align-items-center w-100">
    <!-- Rango + selector de filas -->
    <div class="d-flex align-items-center gap-3">
      <div class="text-muted">
        Mostrando <strong>{{ rangeStart }}</strong> – <strong>{{ rangeEnd }} </strong> de
        <strong>{{ total }}</strong>
      </div>

      <div class="d-flex align-items-center gap-2">
        <label class="text-muted mb-0">Filas:</label>
        <select
          class="form-select form-select-sm w-auto"
          :disabled="disabled"
          :value="perPage >= total && total > 0 ? 'all' : String(perPage)"
          @change="onChangePerPage"
        >
          <option v-for="opt in perPageOptions" :key="String(opt)" :value="opt === 'all' ? 'all' : String(opt)">
            {{ opt === "all" ? "All" : opt }}
          </option>
        </select>
      </div>
    </div>

    <!-- Paginador -->
    <nav aria-label="Paginación">
      <ul class="pagination pagination-sm pagination-primary mb-0">
        <li class="page-item" :class="{ disabled: disabled || page <= 1 }">
          <button class="page-link" type="button" aria-label="Anterior" @click="prev">«</button>
        </li>

        <li
          v-for="(pg, i) in pages"
          :key="i"
          class="page-item"
          :class="{ active: pg === page, disabled: pg === '...' || disabled }"
        >
          <button
            v-if="pg !== '...'"
            class="page-link"
            type="button"
            :aria-current="pg === page ? 'page' : undefined"
            @click="go(pg as number)"
            @mouseup="(e) => (e.currentTarget as HTMLButtonElement)?.blur()"
          >
            {{ pg }}
          </button>
          <span v-else class="page-link disabled">…</span>
        </li>

        <li class="page-item" :class="{ disabled: disabled || page >= totalPages }">
          <button class="page-link" type="button" aria-label="Siguiente" @click="next">»</button>
        </li>
      </ul>
    </nav>
  </div>
</template>
