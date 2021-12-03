import store from '@/store'
import * as api from '@/api';

//laboran
import laboranRoutes from "./laboran.js";
import studentRoutes from "./student.js";
import aslabRoutes from "./aslab.js";
import asprakRoutes from "./asprak.js";
import etcRoutes from "./etc.js";

const baseRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../../views/pages/auth/login'),
        meta: {
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters.getLoggedUser) {
                    // Redirect to the home page instead
                    return api.validateUser().then(response => {
                        // console.log(response.data.data)
                        response.data.data.token = store.getters.getLoggedUser.token
                        store.commit('LOGGED_USER', response.data.data)

                        let role = store.getters.getRoleUser
                        if (!role) {
                            store.commit('ROLE_USER', response.data.data.roles[0])
                        }
                        next({ name: 'home' })
                    })
                    .catch(error => {
                        store.dispatch('logOut')
                        //console.log(error)
                        next({params: { tokenExpired: true }})
                    })
                    
                } else {
                    // Continue to the login page
                    next()
                }
            },
        },
    },
    {
        path: '/logout',
        name: 'logout',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let loggedUser = store.getters.getLoggedUser
                if(loggedUser){
                    api.logout(loggedUser.user_id).then(response => {
                        //
                    })
                    .catch(error => {
                        //
                    });
                }
                store.dispatch('logOut')
                const authRequiredOnPreviousRoute = routeFrom.matched.some(
                    (route) => route.push('/login')
                )
                // Navigate back to previous page, or home as a fallback
                next(authRequiredOnPreviousRoute ? { name: 'home' } : { ...routeFrom })
            },
        },
    },
    {
        path: '/profile',
        name: 'profile',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/auth/profile')
    },
    {
        path: '/',
        name: 'home',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/dashboard/index')
    },
    {
        path: '/settings/change-password',      
        name: 'settings',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/pengaturan/change-password')
    },
]

const routes = baseRoutes.concat(laboranRoutes, studentRoutes, aslabRoutes, asprakRoutes, etcRoutes);
export default routes;