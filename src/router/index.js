import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'

import routes from './routes'
import store from '@/store'
import { api } from '@/api'

Vue.use(VueRouter)
Vue.use(VueMeta, {
  // The component option name that vue-meta looks for meta info on.
  keyName: 'page',
})

const router = new VueRouter({
  routes,
  // Use the HTML5 history API (i.e. normal-looking routes)
  // instead of routes with hashes (e.g. example.com/#/about).
  // This may require some server configuration in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  mode: 'history',
  // Simulate native-like scroll behavior when navigating to a new
  // route and using back/forward buttons.
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
})

// Before each route evaluates...
router.beforeEach((routeTo, routeFrom, next) => {
    // Check if auth is required on this route
    // (including nested routes).
    const authRequired = routeTo.matched.some((route) => route.meta.authRequired)

    // If auth isn't required for the route, just continue.
    if (!authRequired) return next()

    // Get logged user
    let loggedUser = store.getters.getLoggedUser
    // If auth is required and the user is logged in...
    if (loggedUser){
      return api.validateUser().then(response => {
        // console.log(response.data.data)
        response.data.data.token = store.getters.getLoggedUser.token
        store.commit('LOGGED_USER', response.data.data)
        
        let role = store.getters.getRoleUser
        if (!role) {
            store.commit('ROLE_USER', response.data.data.roles[0])
        }
        next()
      })
      .catch(error => {
        store.dispatch('logOut')
        console.log(error)
        redirectToLogin("expired")
      })
    }

    // If auth is required and the user is NOT currently logged in,
    // redirect to login.
    redirectToLogin()

    // eslint-disable-next-line no-unused-vars
    // eslint-disable-next-line no-inner-declarations
    function redirectToLogin(status) {
      // Pass the original route to the login component
      //next({ name: 'login', query: { redirectFrom: routeTo.fullPath } })

      switch(status) {
        case "expired":
          next({ name: 'login', params: { tokenExpired: true } })
          break;
        default:
          next({ name: 'login' })
      }
    }
})

router.beforeResolve(async (routeTo, routeFrom, next) => {
  // Create a `beforeResolve` hook, which fires whenever
  // `beforeRouteEnter` and `beforeRouteUpdate` would. This
  // allows us to ensure data is fetched even when params change,
  // but the resolved route does not. We put it in `meta` to
  // indicate that it's a hook we created, rather than part of
  // Vue Router (yet?).
  try {
    // For each matched route...
    for (const route of routeTo.matched) {
      await new Promise((resolve, reject) => {
        // If a `beforeResolve` hook is defined, call it with
        // the same arguments as the `beforeEnter` hook.
        if (route.meta && route.meta.beforeResolve) {
          route.meta.beforeResolve(routeTo, routeFrom, (...args) => {
            // If the user chose to redirect...
            if (args.length) {
              // If redirecting to the same route we're coming from...
              // Complete the redirect.
              next(...args)
              reject(new Error('Redirected'))
            } else {
              resolve()
            }
          })
        } else {
          // Otherwise, continue resolving the route.
          resolve()
        }
      })
    }
    // If a `beforeResolve` hook chose to redirect, just return.
  } catch (error) {
    return
  }

  // If we reach this point, continue resolving the route.
  next()
})

export default router
