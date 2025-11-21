import Toast, { TYPE } from "vue-toastification";
import "vue-toastification/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  const options = {
    toastDefaults: {
      [TYPE.SUCCESS]: {
        timeout: 5000,
      },
      [TYPE.ERROR]: {
        timeout: 5000,
      },
      [TYPE.INFO]: {
        timeout: 5000,
      },
      [TYPE.WARNING]: {
        timeout: 5000,
      },
    },
  };

  nuxtApp.vueApp.use(Toast, options);
});
