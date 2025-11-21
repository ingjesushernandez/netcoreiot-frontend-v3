export default defineNuxtConfig({
  compatibilityDate: "2025-11-01",
  devtools: { enabled: false },
  ssr: false,
  srcDir: "src",
  spaLoadingTemplate: false,

  runtimeConfig: {
    public: {
      company: "",
      companyWebsite: "",
      companyLogo: "",
      apiUri: "",
    },
  },

  css: ["@/assets/scss/app.scss", "@/assets/css/style.css", "@/assets/css/responsive.css", "@/assets/css/main.css"],

  app: {
    head: {
      htmlAttrs: {
        lang: "es",
      },
      meta: [{ "http-equiv": "X-UA-Compatible", content: "IE=edge" }],
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1, maximum-scale=1",
      title: "NetCoreIoT",
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "shortcut icon", type: "image/x-icon", href: "/favicon.ico" },
      ],
    },
  },

  modules: [
    "~/modules/theme/module",
    "~/modules/auth/module",
    "~/modules/home/module",
    "~/modules/users/module",
    "~/modules/settings/module",

    "nuxt-icon",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore"],
      },
    ],
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          Rubik: {
            wght: [400, 500, 700],
            ital: [400, 500, 700],
          },
          Roboto: {
            wght: [300, 400, 500, 700, 900],
            ital: [300, 400, 500, 700, 900],
          },
          download: true,
          inject: true,
        },
      },
    ],
  ],

  appConfig: {
    nuxtIcon: {
      size: "1.5em",
    },
  },
});
