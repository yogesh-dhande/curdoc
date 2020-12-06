import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login'
import User from './components/User'
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
                path: '/:userName',
                component: User,
                meta: {
                    requiresAuth: true
                },
                props: true
            },
            {
                path: '/:userName/:projectName',
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
                path: '*',
                component: Home,
            },
        ]

    },

);


router.beforeEach((to, from, next) => {
    let path = to.fullPath
    console.log(to)
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (!firebase.auth().currentUser) {
          next({
            path: '/login',
            query: { redirect: path }
          })
        } else {
          next()
        }
      } else {
        next() // make sure to always call next()!
      }
  });

export default router
