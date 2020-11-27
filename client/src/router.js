import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login'
import CodeEditor from './components/CodeEditor'
import AppPreview from './components/AppPreview.vue'
import Profile from './components/Profile'
import Home from './components/Home'
import Feedback from './components/Feedback'
import firebase from 'firebase'

Vue.use(Router);

let router = new Router({
        mode: 'history',

        routes: [
            {
                path: '/feedback',
                component: Feedback,
            },
            {
                path: '/profile',
                component: Profile,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: '/login',
                component: Login,
                meta: {
                    requiresAuth: false
                }
            },
            {
                path: '/:userName/:projectName',
                component: CodeEditor,
                meta: {
                    requiresAuth: false
                },
                redirect: '/:userName/:projectName/code',
            },
            {
                path: '/:userName/:projectName/code',
                component: CodeEditor,
                meta: {
                    requiresAuth: false
                },
                props: true
            },
            {
                path: '/:userName/:projectName/app',
                component: AppPreview,
                meta: {
                    requiresAuth: false
                },
                props: true
            },
            {
                path: '/',
                component: Home,
            },
        ]

    },

);


router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some((x) => x.meta.requiresAuth);
    const currentUser = firebase.auth().currentUser;
  
    if (requiresAuth && !currentUser) {
      next("/login");
    } else if (requiresAuth && currentUser) {
      next();
    } else {
      next();
    }
  });

export default router
