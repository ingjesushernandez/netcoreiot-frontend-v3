import { defineNuxtModule } from "@nuxt/kit";
import { resolve } from "pathe";

const metaData = "home";

export default defineNuxtModule({
  meta: { name: `${metaData}-module`, configKey: `${metaData}Module` },

  setup(_opts, nuxt) {
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

/*
 * Middleware
 *  meta: { auth: true, perms: ['device:findall'] },
 *  meta: { auth: true, perms: ['device:findall', 'device:update'], mode: 'any' }
 *  meta: { auth: true, perms: ['device:findall', 'device:update'], mode: 'all' }
 */

/*
 * Permissions
 *
 * const { can, canAny, canAll } = usePermissions();
 *
 * <button v-if="can('device:create')"> Nuevo dispositivo </button>
 * <button v-if="canAny(['device:update','device:delete'])"> Cualquiera de estos </button>
 * <button v-if="canAll(['report:read','report:export'])"> Todos estos </button>
 */
