import { defineNuxtModule } from "@nuxt/kit";
import { resolve, join } from "pathe";

const metaData = "templates";

export default defineNuxtModule({
  meta: { name: `${metaData}-module`, configKey: `${metaData}Module` },

  setup: (_opts, nuxt) => {
    nuxt.hook("components:dirs", (dirs) => {
      dirs.push({ path: join(__dirname, "./components") });
    });

    nuxt.hook("imports:dirs", (dirs) => {
      dirs.push(resolve(__dirname, "./composables"));
      dirs.push(resolve(__dirname, "./interfaces"));
      dirs.push(resolve(__dirname, "./stores"));
    });

    nuxt.hook("pages:extend", (pages) => {
      pages.push(
        {
          name: "templates-index",
          path: "/templates",
          file: resolve(__dirname, "./pages/index.vue"),
          meta: { auth: true, perms: ["template:findall"] },
        },
        {
          name: "templates-new",
          path: "/templates/new",
          file: resolve(__dirname, "./pages/new.vue"),
          meta: { auth: true, perms: ["template:create"] },
        },
        {
          name: "templates-id",
          path: "/templates/:id",
          file: resolve(__dirname, "./pages/[id].vue"),
          meta: { auth: true, perms: ["template:findbyid"] },
        },
        {
          name: "templates-edit",
          path: "/templates/edit/:id",
          file: resolve(__dirname, "./pages/edit-[id].vue"),
          meta: { auth: true, perms: ["template:update"] },
        }
      );
    });
  },
});
