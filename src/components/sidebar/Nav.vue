<script setup lang="ts">
import { navItems, type NavItem, type NavPermMode } from "~/utils/constants";
const {
  public: { company },
} = useRuntimeConfig();
const emit = defineEmits<{ (e: "close"): void }>();
const openMap = reactive<Record<string, boolean>>({});

const isSub = (it: NavItem): it is Extract<NavItem, { type: "sub" }> => it.type === "sub";
const isLink = (it: NavItem): it is Extract<NavItem, { type: "link" }> => it.type === "link";

const collapsedMenu = (title: string) => !openMap[title];
const toggleMenuLinks = (title: string) => {
  openMap[title] = !openMap[title];
};
const closeMenuLinks = () => emit("close");

const DURATION = 500;

const onEnter = (el: Element) => {
  const e = el as HTMLElement;
  e.style.height = "0px";
  e.style.overflow = "hidden";
  e.style.transition = `height ${DURATION}ms ease`;
  requestAnimationFrame(() => {
    e.style.height = `${e.scrollHeight}px`;
  });
};

const onAfterEnter = (el: Element) => {
  const e = el as HTMLElement;
  e.style.transition = "";
  e.style.height = "";
  e.style.overflow = "";
};

const onLeave = (el: Element) => {
  const e = el as HTMLElement;
  e.style.height = `${e.scrollHeight}px`;
  e.style.overflow = "hidden";
  e.style.transition = `height ${DURATION}ms ease`;
  requestAnimationFrame(() => {
    e.style.height = "0px";
  });
};

const onAfterLeave = (el: Element) => {
  const e = el as HTMLElement;
  e.style.transition = "";
  e.style.height = "";
  e.style.overflow = "";
};

// Permissions
const { canAny, canAll } = usePermissions();
const allow = (perms?: string[], mode: NavPermMode = "any") => {
  if (!perms?.length) return true;
  return mode === "all" ? canAll(perms) : canAny(perms);
};
const visibleItems = computed(
  () =>
    navItems
      .map((it) => {
        if (it.type === "link") {
          return allow(it.perms, it.mode) ? it : null;
        }
        const children = it.children.filter((ch) => allow(ch.perms, ch.mode));
        const showSub = allow(it.perms, it.mode) || children.length > 0;
        if (!showSub) return null;
        return { ...it, children };
      })
      .filter(Boolean) as NavItem[]
);
</script>

<template>
  <nav class="sidebar-main">
    <div id="sidebar-menu">
      <ul class="sidebar-links custom-scrollbar m-0 pt-3">
        <!-- Back/logo -->
        <li class="back-btn">
          <NuxtLink :to="{ name: 'home-index' }" title="Ir al Inicio">
            <img class="img-fluid" src="~/assets/img/logo/logo-icon.png" :alt="`Logotipo ${company}`" width="35" />
          </NuxtLink>
          <div class="mobile-back text-end">
            <span>Back</span>
            <Icon style="font-size: 16px" class="ps-2" name="fa6-solid:angle-right" aria-hidden="true" />
          </div>
        </li>

        <!-- Items -->
        <li
          v-for="(it, idx) in visibleItems"
          :key="idx"
          class="sidebar-list"
          :title="isLink(it) || isSub(it) ? it.tooltip : ''"
          @click="isLink(it) ? closeMenuLinks() : undefined"
        >
          <!-- Link directo -->
          <template v-if="isLink(it)">
            <NuxtLink class="sidebar-link sidebar-title link-nav" :to="{ name: it.name }">
              <Icon v-if="it.icon" :name="it.icon" />
              <span>{{ it.title }}</span>
            </NuxtLink>
          </template>

          <!-- Submenú -->
          <template v-else-if="isSub(it)">
            <a
              href="javascript:void(0)"
              class="sidebar-link sidebar-title has-dropdown"
              :class="{ collapsed: collapsedMenu(it.title) }"
              :aria-expanded="!collapsedMenu(it.title)"
              @click.prevent="toggleMenuLinks(it.title)"
            >
              <Icon v-if="it.icon" :name="it.icon" />
              <span>{{ it.title }}</span>
              <div class="according-menu">
                <Icon
                  :name="collapsedMenu(it.title) ? 'fa6-solid:angle-right' : 'fa6-solid:angle-down'"
                  :aria-label="collapsedMenu(it.title) ? 'Expandir' : 'Contraer'"
                  aria-hidden="false"
                />
              </div>
            </a>
            <Transition @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave" @after-leave="onAfterLeave">
              <ul v-show="!collapsedMenu(it.title)" class="sidebar-submenu">
                <li v-for="(ch, cidx) in it.children" :key="cidx" :title="ch.tooltip">
                  <NuxtLink class="link-nav" :to="{ name: ch.name }">
                    {{ ch.title }}
                  </NuxtLink>
                </li>
              </ul>
            </Transition>
          </template>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.sidebar-submenu {
  will-change: height;
}
</style>
