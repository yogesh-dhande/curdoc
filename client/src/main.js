import Vue from "vue";
import App from "./App.vue";
import router from "./router";
const fb = require("./firebaseConfig.js");

import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSeedling, faCat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
Vue.use(BootstrapVue);
library.add(faSeedling, faCat);
Vue.component("font-awesome-icon", FontAwesomeIcon);

import store from "./store.js";

Vue.config.productionTip = false;


let app;

// handle page reload
fb.auth.onAuthStateChanged((user) => {
  if (!app) {

    app = new Vue({
      el: "#app",
      router,
      store,
      render: (h) => h(App),
    });
  }

  if (user) {
    store.commit("setCurrentUser", user.email);
  }

});
