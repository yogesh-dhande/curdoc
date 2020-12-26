import firebase from 'firebase'
import Vue from 'vue'
import Router from 'vue-router'
import AppPreview from './components/AppPreview.vue'
import CodeEditor from './components/CodeEditor'
import Feedback from './components/Feedback'
import Home from './components/Home'
import Login from './components/Login'
import Profile from './components/Profile'
import User from './components/User'

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
    console.log(firebase.auth())
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
