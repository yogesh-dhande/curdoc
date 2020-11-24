import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login'
import CodeEditor from './components/CodeEditor'
import AppPreview from './components/AppPreview.vue'
import Profile from './components/Profile'
import Home from './components/Home'
import firebase from 'firebase'

Vue.use(Router);

let router = new Router({
        mode: 'history',

        routes: [
            {
                path: '*',
                component: Home,
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
                path: '/:userId/:projectId',
                component: CodeEditor,
                meta: {
                    requiresAuth: false
                },
                redirect: '/:userId/:projectId/code',
            },
            {
                path: '/:userId/:projectId/code',
                component: CodeEditor,
                meta: {
                    requiresAuth: false
                },
                props: true
            },
            {
                path: '/:userId/:projectId/app',
                component: AppPreview,
                meta: {
                    requiresAuth: false
                },
                props: true
            }
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
