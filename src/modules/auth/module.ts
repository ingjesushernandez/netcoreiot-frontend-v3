import { defineNuxtModule } from "@nuxt/kit";
import { resolve, join } from "pathe";

const metaData = "auth";

export default defineNuxtModule({
  meta: { name: `${metaData}-module`, configKey: `${metaData}Module` },

  setup(_opts, nuxt) {
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
          name: "auth-login",
          path: "/login",
          file: resolve(__dirname, "./pages/login.vue"),
          meta: { layout: "custom", middleware: "no-auth" },
        },
        {
          name: "auth-forgot",
          path: "/forgot-password",
          file: resolve(__dirname, "./pages/forgot-password/index.vue"),
          meta: { layout: "custom", middleware: "no-auth" },
        },
        {
          name: "auth-reset",
          path: "/forgot-password/:token",
          file: resolve(__dirname, "./pages/forgot-password/[token].vue"),
          meta: { layout: "custom", middleware: "no-auth" },
        },
        {
          name: "auth-verify",
          path: "/verify-account/:token",
          file: resolve(__dirname, "./pages/verify-account/[token].vue"),
          meta: { layout: "custom", middleware: "no-auth" },
        }
      );
    });
  },
});
