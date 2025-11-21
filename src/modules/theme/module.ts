import { defineNuxtModule } from "@nuxt/kit";
import { resolve } from "pathe";

const metaData = "theme";

export default defineNuxtModule({
  meta: { name: `${metaData}-module`, configKey: `${metaData}Module` },

  setup(_opts, nuxt) {
    nuxt.hook("imports:dirs", (dirs) => {
      dirs.push(resolve(__dirname, "./composables"));
    });
  },
});
