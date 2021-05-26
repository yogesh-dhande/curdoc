import AppPreview from "@/views/AppPreview";
import Error from "@/views/Error";
import Feedback from "@/views/Feedback";
import Home from "@/views/Home";
import LoginPage from "@/views/LoginPage";
import Profile from "@/views/Profile";
import Project from "@/views/Project";
import Vue from "vue";
import Router from "vue-router";
import { auth } from "./firebaseConfig";

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
      component: LoginPage,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/error",
      component: Error,
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
      redirect: "/code",
    },
    {
      path: "/:userName/:projectName/code",
      component: Project,
      meta: {
        requiresAuth: false,
      },
      props: true,
    },
    {
      path: "/:userName/:projectName/app",
      component: AppPreview,
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
    if (!auth.currentUser) {
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
