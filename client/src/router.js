import firebase from "firebase";
import Vue from "vue";
import Router from "vue-router";
import Error from "./components/Error";
import Feedback from "./components/Feedback";
import Home from "./components/Home";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Project from "./components/Project";
import User from "./components/User";

Vue.use(Router);

let router = new Router({
  mode: "history",

  routes: [
    {
      path: "/feedback",
      component: Feedback,
    },
    {
      path: "/profile",
      component: Profile,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/login",
      component: Login,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/error",
      component: Error,
    },
    {
      path: "/:userName",
      component: User,
      meta: {
        requiresAuth: true,
      },
      props: true,
    },
    {
      path: "/",
      component: Home,
    },
    {
      path: "/:userName/:projectName",
      component: Project,
      meta: {
        requiresAuth: false,
      },
      props: (route) => {
        return {
          ...route.params,
          layout: route.query.layout ? route.query.layout : "code",
        };
      },
    },
    {
      path: "/:userName/:projectName/code",
      component: Project,
      meta: {
        requiresAuth: false,
      },
      props: (route) => {
        return {
          ...route.params,
          layout: "code",
        };
      },
    },
    {
      path: "/:userName/:projectName/app",
      component: Project,
      meta: {
        requiresAuth: false,
      },
      props: (route) => {
        return {
          ...route.params,
          layout: "app",
        };
      },
    },
    {
      path: "*",
      component: Home,
    },
  ],
});

router.beforeEach((to, from, next) => {
  let path = to.fullPath;
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!firebase.auth().currentUser) {
      next({
        path: "/login",
        query: { redirect: path },
      });
    } else {
      next();
    }
  } else {
    next(); // make sure to always call next()!
  }
});

export default router;
