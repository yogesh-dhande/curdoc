import path from "path";
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";

require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
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
    "~/plugins/firebaseConfig.js",
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
    "@nuxtjs/firebase",
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa",
  ],

  firebase: {
    config: {
      apiKey: process.env.NUXT_ENV_FIREBASE_CONFIG_API_KEY,
      authDomain: process.env.NUXT_ENV_FIREBASE_CONFIG_AUTH_DOMAIN,
      projectId: process.env.NUXT_ENV_FIREBASE_CONFIG_PROJECT_ID,
      storageBucket: process.env.NUXT_ENV_STORAGE_BUCKET,
      messagingSenderId: process.env.NUXT_ENV_MESSAGING_SENDER_ID,
      appId: process.env.NUXT_ENV_ID,
      measurementId: process.env.NUXT_ENV_MEASUREMENT_ID,
    },
    services: {
      auth: {
        persistence: "local", // default
        initialize: {
          onAuthStateChangedAction: "onAuthStateChangedAction",
          subscribeManually: false,
        },
        ssr: false, // default
        // emulatorPort: isDev ? 10000 : undefined,
        // emulatorHost: isDev ? "http://localhost" : undefined,
      },
      functions: {
        location: "us-central1",
        // emulatorPort: isDev ? 10001 : undefined,
        // emulatorHost: isDev ? "localhost" : undefined,
      },
      firestore: {
        memoryOnly: false, // default
        enablePersistence: !isDev,
        // emulatorPort: isDev ? 10002 : undefined,
        // emulatorHost: isDev ? "localhost" : undefined,
      },
      storage: true,
      analytics: {
        collectionEnabled: true, // default
      },
    },
  },
  pwa: {
    // disable the modules you don't need
    meta: false,
    icon: false,
    // if you omit a module key form configuration sensible defaults will be applied
    // manifest: false,

    workbox: {
      importScripts: [
        // ...
        "/firebase-auth-sw.js",
      ],
      // by default the workbox module will not install the service worker in dev environment to avoid conflicts with HMR
      // only set this true for testing and remember to always clear your browser cache in development
      dev: false,
    },
  },
  publicRuntimeConfig: {
    backendUrl: `${process.env.NUXT_APP_WEB_PROTOCOL}://${process.env.NUXT_APP_ORIGIN_DOMAIN}/sandbox`,
    lspUrl: `ws://${process.env.NUXT_APP_ORIGIN_DOMAIN}/sandbox/lsp/`,
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
