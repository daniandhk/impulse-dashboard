import store from '@/store'

export default [
    //path asprak
    {
        path: '/asprak/schedule',
        name: 'asprak-schedule',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'asprak'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/asprak/schedule')
    },

    {
        path: '/asprak/schedule/detail/:id',
        name: 'asprak-schedule-detail',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'asprak'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/asprak/schedule-detail')
    },

    {
        path: '/asprak/schedule/find',
        name: 'asprak-find-practicum',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'asprak'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/asprak/find-practicum')
    },

    {
        path: '/asprak/schedule/practicum/:id',
        name: 'asprak-start-practicum',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'asprak'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/asprak/start-practicum')
    },

    {
        path: '/asprak/input-soal',
        name: 'asprak-input-soal',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'asprak'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/asprak/input-soal/input-soal')
    },

    {
        path: '/input-soal/create-test',
        name: 'asprak-create-test',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'asprak'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/asprak/input-soal/create-test')
    },

    {
        path: '/asprak/lihat-feedback',
        name: 'asprak-lihat-feedback',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'asprak'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/asprak/lihat-feedback')
    },

    {
        path: '/absen/absensi-asprak',
        name: 'asprak-absensi-asprak',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'asprak'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/asprak/absen/absensi-asprak')
    },

    {
        path: '/absen/berita-acara',
        name: 'berita-acara-asprak',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'asprak'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/asprak/absen/berita-acara')
    },
]
