import store from '@/store'
import { api } from '@/api'

export default [
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/pages/auth/login'),
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
                        console.log(error)
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
        path: '/',
        name: 'home',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/dashboard/index')
    },
    {
        path: '/laboran/student-class',
        name: 'laboran-studentclass',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/laboran/student-class')
    },
    {
        path: '/laboran/student',
        name: 'laboran-student',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/laboran/student')
    },
    {
        path: '/laboran/staff',
        name: 'laboran-staff',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/laboran/staff')
    },
    {
        path: '/laboran/course',
        name: 'laboran-course',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/laboran/course')
    },
    {
        path: '/laboran/classroom',
        name: 'laboran-classroom',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/laboran/classroom')
    },
    {
        path: '/aslab/jadwal',
        name: 'aslab-jadwal',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/aslab/kalender')
    },

    {
        path: '/aslab/input-jadwal',
        name: 'aslab-input-jadwal',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/aslab/input-jadwal')
    },
    //path praktikan
    {
        path: '/praktikan/jadwal',
        name: 'praktikan-jadwal',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/student/jadwal')
    },
    {
        path: '/praktikan/matakuliah',
        name: 'praktikan-matakuliah',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/student/matakuliah')
    },
    {
        path: '/praktikan/nilai',
        name: 'praktikan-nilai',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/student/nilai')
    },

    //ini paling bawah
    {
        path :'*',
        component: () => import('../views/pages/utility/error-404')
    },
]
