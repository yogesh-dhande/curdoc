const path = require("path");

const deployTarget = process.env.DEPLOY_TARGET || "staging";
console.log("deploy target: ", deployTarget);

const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

require("dotenv").config({
  path: path.resolve(__dirname, `envs/.env.${deployTarget}.local`),
});

export default {
  target: "static",
  env: {
    baseUrl: `${process.env.NUXT_APP_WEB_PROTOCOL}://${process.env.NUXT_APP_ORIGIN_DOMAIN}/`,
    lspUrl: `${process.env.NUXT_APP_WEBSOCKET_PROTOCOL}://${process.env.NUXT_APP_ORIGIN_DOMAIN}/lsp/`,
    useFirebaseEmulators: process.env.USE_FIREBASE_EMULATORS,
    functionsUrl: process.env.NUXT_ENV_FIREBASE_FUNCTIONS_URL,
    apiKey: process.env.NUXT_ENV_FIREBASE_CONFIG_API_KEY,
    authDomain: process.env.NUXT_ENV_FIREBASE_CONFIG_AUTH_DOMAIN,
    projectId: process.env.NUXT_ENV_FIREBASE_CONFIG_PROJECT_ID,
    storageBucket: process.env.NUXT_ENV_STORAGE_BUCKET,
    messagingSenderId: process.env.NUXT_ENV_MESSAGING_SENDER_ID,
    appId: process.env.NUXT_ENV_ID,
  },
  ssr: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Curdoc",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🗔</text></svg>",
      },
    ],
  },
  loading: {
    color: "#60A5FA",
    height: "5px",
  },
  loadingIndicator: {
    name: "wandering-cubes",
    color: "#60A5FA",
    background: "#1F2937",
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "~/plugins/firebase.client.js",
    "~/plugins/analytics.client.js",
    "~/plugins/editor.client.js",
    "~/plugins/meta.js",
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    "@nuxtjs/eslint-module",
    // https://go.nuxtjs.dev/tailwindcss
    "@nuxtjs/tailwindcss",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    // https://go.nuxtjs.dev/pwa
  ],
  publicRuntimeConfig: {},
  alias: {
    vscode: require.resolve("monaco-languageclient/lib/vscode-compatibility"),
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    plugins: [new MonacoWebpackPlugin()],
    postcss: {
      plugins: {
        "postcss-custom-properties": false,
      },
    },
    extend(config) {
      config.node = {
        setImmediate: true,
        net: "empty",
      };
      config.resolve.extensions.push(".js", ".json", ".ttf");
    },
  },
};
