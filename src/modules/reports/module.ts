import { defineNuxtModule } from "@nuxt/kit";
import { resolve, join } from "pathe";

const metaData = "reports";

export default defineNuxtModule({
  meta: { name: `${metaData}-module`, configKey: `${metaData}Module` },

  setup: (_opts, nuxt) => {
    nuxt.hook("components:dirs", (dirs) => {
      dirs.push({ path: join(__dirname, "./components") });
    });

    nuxt.hook("imports:dirs", (dirs) => {
      dirs.push(resolve(__dirname, "./composables"));
      dirs.push(resolve(__dirname, "./interfaces"));
    });

    nuxt.hook("pages:extend", (pages) => {
      pages.push({
        name: "reports-index",
        path: "/reports",
        file: resolve(__dirname, "./pages/index.vue"),
        meta: { auth: true, perms: ["data:get_report"] },
      });
    });
  },
});
