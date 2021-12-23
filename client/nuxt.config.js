import path from "path";
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

const deployTarget = process.env.DEPLOY_TARGET || "staging";
console.log("deploy target: ", deployTarget);

require("dotenv").config({
  path: path.resolve(__dirname, `envs/.env.${deployTarget}.local`),
});

export default {
  target: "static",
  ssr: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Broccolini",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
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
  publicRuntimeConfig: {
    baseUrl: process.env.NUXT_ENV_BASE_URL,
    backendUrl: `${process.env.NUXT_APP_WEB_PROTOCOL}://${process.env.NUXT_APP_ORIGIN_DOMAIN}/sandbox1`,
    lspUrl: `ws://${process.env.NUXT_APP_ORIGIN_DOMAIN}/lsp/`,
    apiKey: process.env.NUXT_ENV_FIREBASE_CONFIG_API_KEY,
    authDomain: process.env.NUXT_ENV_FIREBASE_CONFIG_AUTH_DOMAIN,
    projectId: process.env.NUXT_ENV_FIREBASE_CONFIG_PROJECT_ID,
    storageBucket: process.env.NUXT_ENV_STORAGE_BUCKET,
    messagingSenderId: process.env.NUXT_ENV_MESSAGING_SENDER_ID,
    appId: process.env.NUXT_ENV_ID,
    measurementId: process.env.NUXT_ENV_MEASUREMENT_ID,
    functionsUrl: process.env.NUXT_ENV_FIREBASE_FUNCTIONS_URL,
    useFirebaseEmulators: deployTarget === "development",
  },
  alias: {
    vscode: require.resolve("monaco-languageclient/lib/vscode-compatibility"),
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    plugins: [new MonacoWebpackPlugin()],
    extend(config) {
      config.node = {
        setImmediate: true,
        net: "empty",
      };
      config.resolve.extensions.push(".js", ".json", ".ttf");
    },
  },
};
