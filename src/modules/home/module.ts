import { defineNuxtModule } from "@nuxt/kit";
import { resolve } from "pathe";

const metaData = "home";

export default defineNuxtModule({
  meta: { name: `${metaData}-module`, configKey: `${metaData}Module` },

  setup(_opts, nuxt) {
    nuxt.hook("imports:dirs", (dirs) => {
      dirs.push(resolve(__dirname, "./composables"));
    });

    nuxt.hook("pages:extend", (pages) => {
      pages.push({
        name: "home-index",
        path: "/",
        file: resolve(__dirname, "./pages/index.vue"),
        meta: { auth: true },
      });
    });
  },
});
