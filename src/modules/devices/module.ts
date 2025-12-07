import { defineNuxtModule } from "@nuxt/kit";
import { resolve } from "pathe";

const metaData = "devices";

export default defineNuxtModule({
  meta: { name: `${metaData}-module`, configKey: `${metaData}Module` },

  setup: (_opts, nuxt) => {
    nuxt.hook("imports:dirs", (dirs) => {
      dirs.push(resolve(__dirname, "./composables"));
      dirs.push(resolve(__dirname, "./interfaces"));
      dirs.push(resolve(__dirname, "./stores"));
    });

    nuxt.hook("pages:extend", (pages) => {
      pages.push(
        {
          name: "devices-index",
          path: "/devices",
          file: resolve(__dirname, "./pages/index.vue"),
          meta: { auth: true, perms: ["device:findall"] },
        },
        {
          name: "devices-new",
          path: "/devices/new",
          file: resolve(__dirname, "./pages/new.vue"),
          meta: { auth: true, perms: ["device:create"] },
        },
        {
          name: "devices-id",
          path: "/devices/:id",
          file: resolve(__dirname, "./pages/[id].vue"),
          meta: { auth: true, perms: ["device:findbyid"] },
        }
      );
    });
  },
});
