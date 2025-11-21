<script setup lang="ts">
interface Crumb {
  label: string;
  toName?: string;
  params?: Record<string, any>;
  query?: Record<string, any>;
}

const props = withDefaults(
  defineProps<{
    title: string;
    items?: Crumb[];
    homeHref?: string;
  }>(),
  {
    items: () => [],
    homeHref: "/assets/svg/icon-sprite.svg#stroke-home",
  }
);
</script>

<template>
  <div class="container-fluid">
    <div class="page-title">
      <div class="row">
        <div class="col-sm-6">
          <h3>{{ title }}</h3>
        </div>

        <div class="col-sm-6">
          <ol class="breadcrumb mb-0 justify-content-sm-end">
            <li class="breadcrumb-item">
              <NuxtLink class="link" :to="{ name: 'home-index' }">
                <svg class="stroke-icon" aria-hidden="true"><use :href="homeHref" /></svg>
                <span class="visually-hidden">Inicio</span>
              </NuxtLink>
            </li>

            <li
              v-for="(it, i) in props.items"
              :key="i"
              class="breadcrumb-item"
              :class="{ active: i === props.items.length - 1 }"
              aria-current="page"
            >
              <template v-if="it.toName && i !== props.items.length - 1">
                <NuxtLink :to="{ name: it.toName, params: it.params, query: it.query }">
                  {{ it.label }}
                </NuxtLink>
              </template>
              <template v-else>
                {{ it.label }}
              </template>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>
