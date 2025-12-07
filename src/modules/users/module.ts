import { defineNuxtModule } from "@nuxt/kit";
import { resolve } from "pathe";

const metaData = "users";

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
          name: "users-index",
          path: "/users",
          file: resolve(__dirname, "./pages/index.vue"),
          meta: { auth: true, perms: ["user:findall"] },
        },
        {
          name: "users-new",
          path: "/users/new",
          file: resolve(__dirname, "./pages/new.vue"),
          meta: { auth: true, perms: ["user:create"] },
        },
        {
          name: "users-id",
          path: "/users/:id",
          file: resolve(__dirname, "./pages/[id].vue"),
          meta: { auth: true, perms: ["user:findbyid"] },
        },
        {
          name: "users-edit",
          path: "/users/edit/:id",
          file: resolve(__dirname, "./pages/edit-[id].vue"),
          meta: { auth: true, perms: ["user:update"] },
        }
      );
    });
  },
});
