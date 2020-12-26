import { library } from "@fortawesome/fontawesome-svg-core";
import { faCat, faSeedling } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import BootstrapVue from "bootstrap-vue";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "bootstrap/dist/css/bootstrap.css";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store.js";
const fb = require("./firebaseConfig.js");

Vue.use(BootstrapVue);
library.add(faSeedling, faCat);
Vue.component("font-awesome-icon", FontAwesomeIcon);


Vue.config.productionTip = false;


let app;

// handle page reload
fb.auth.onAuthStateChanged((user) => {
  user.getIdToken(/* forceRefresh */ true)
  .then(token => console.log(token))
  
  if (!app) {

    app = new Vue({
      el: "#app",
      router,
      store,
      render: (h) => h(App),
    });
  }

  if (user) {
    store.dispatch("setCurrentUser", user.email);
  }

});
