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
        path: '/profile',
        name: 'profile',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/auth/profile')
    },
    {
        path: '/',
        name: 'home',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/dashboard/index')
    },

    //laboran
    {
        path: '/laboran/student-class',
        name: 'laboran-studentclass',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/laboran/student-class/student-class')
    },
    {
        path: '/laboran/student',
        name: 'laboran-student',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/laboran/student/student')
    },
    {
        path: '/laboran/staff',
        name: 'laboran-staff',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/laboran/staff/staff')
    },
    {
        path: '/laboran/course',
        name: 'laboran-course',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/laboran/course/course')
    },
    {
        path: '/laboran/classroom',
        name: 'laboran-classroom',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/laboran/classroom/classroom')
    },
    {
        path: '/laboran/class-course',
        name: 'laboran-classcourse',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/laboran/class-course/class-course')
    },
    
    //path temp
    {
        path: '/temp/create-test',
        name: 'create-test',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/temp/create-test')
    },

    //aslab
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

    //path asprak
    {
        path: '/asprak/input-soal',
        name: 'asprak-input-soal',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/asprak/input-soal/input-soal')
    },

    {
        path: '/input-soal/create-test',
        name: 'asprak-input-soal',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/asprak/input-soal/create-test')
    },

    {
        path: '/asprak/lihat-feedback',
        name: 'asprak-lihat-feedback',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/asprak/lihat-feedback')
    },

    {
        path: '/asprak/absensi-asprak',
        name: 'asprak-absensi-asprak',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/asprak/absensi-asprak')
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
    {
        path: '/praktikan/praktikum',
        name: 'praktikan-praktikum',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/student/praktikum')
    },
    {
        path: '/praktikan/jurnal',
        name: 'praktikan-jurnal',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/student/jurnal')
    },
    {
        path: '/praktikan/tes_awal',
        name: 'praktikan-tes_awal',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/student/tes_awal')
    },
    {
        path: '/praktikan/tes_akhir',
        name: 'praktikan-tes_akhir',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/student/tes_akhir')
    },
    {
        path: '/praktikan/pengaturan',      
        name: 'praktikan-pengaturan',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/student/pengaturan')
    },

    //ini paling bawah
    {
        path :'*',
        component: () => import('../views/pages/utility/error-404')
    },
    {
        path :'/about-us',
        name: 'about-us',
        component: () => import('../views/pages/utility/about-us')
    },
]
