import { defineNuxtModule } from "@nuxt/kit";
import { resolve } from "pathe";

const metaData = "alarms";

export default defineNuxtModule({
  meta: { name: `${metaData}-module`, configKey: `${metaData}Module` },

  setup: (_opts, nuxt) => {
    nuxt.hook("imports:dirs", (dirs) => {
      dirs.push(resolve(__dirname, "./composables"));
      dirs.push(resolve(__dirname, "./interfaces"));
      dirs.push(resolve(__dirname, "./stores"));
    });

    nuxt.hook("pages:extend", (pages) => {
      pages.push({
        name: "alarms-index",
        path: "/alarms",
        file: resolve(__dirname, "./pages/index.vue"),
        meta: { auth: true, perms: ["emqx:alarm_findall"] },
      });
    });
  },
});
