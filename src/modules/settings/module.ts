import { defineNuxtModule } from "@nuxt/kit";
import { resolve, join } from "pathe";

const metaData = "settings";

export default defineNuxtModule({
  meta: { name: `${metaData}-module`, configKey: `${metaData}Module` },

  setup: (_opts, nuxt) => {
    nuxt.hook("components:dirs", (dirs) => {
      dirs.push({ path: join(__dirname, "./components") });
    });

    nuxt.hook("imports:dirs", (dirs) => {
      dirs.push(resolve(__dirname, "./composables"));
      dirs.push(resolve(__dirname, "./stores"));
    });

    nuxt.hook("pages:extend", (pages) => {
      pages.push(
        {
          name: "settings-roles",
          path: "/settings/roles",
          file: resolve(__dirname, "./pages/roles.vue"),
          meta: {
            auth: true,
            perms: ["role:create", "role:findall", "role:update", "role:delete", "role:catalog"],
            mode: "all",
          },
        },
        {
          name: "settings-profile",
          path: "/settings/profile",
          file: resolve(__dirname, "./pages/profile.vue"),
          meta: {
            auth: true,
            perms: ["user:update", "user:avatar"],
            mode: "any",
          },
        },
        {
          name: "settings-security",
          path: "/settings/security",
          file: resolve(__dirname, "./pages/security.vue"),
          meta: {
            auth: true,
            perms: ["user:password"],
            mode: "any",
          },
        }
      );
    });
  },
});
