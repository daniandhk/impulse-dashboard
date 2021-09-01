import store from '@/store'

export default [
    //path praktikan
    {
        path: '/praktikan/schedule/calendar',
        name: 'praktikan-schedule-calendar',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'student'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/student/schedule/schedule-calendar')
    },
    {
        path: '/praktikan/schedule/list',
        name: 'praktikan-schedule-list',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'student'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/student/schedule/schedule-list')
    },
    {
        path: '/praktikan/schedule/detail/:id',
        name: 'praktikan-schedule-detail',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'student'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/student/schedule/schedule-detail')
    },
    {
        path: '/praktikan/:type/:schedule_test_id/:id',
        name: 'praktikan-schedule-test',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'student'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/student/schedule/schedule-test')
    },
    {
        path: '/praktikan/matakuliah',
        name: 'praktikan-matakuliah',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'student'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/student/matakuliah')
    },
    {
        path: '/praktikan/nilai',
        name: 'praktikan-nilai',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'student'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/student/nilai')
    },
    {
        path: '/praktikan/praktikum',
        name: 'praktikan-praktikum',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'student'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/student/praktikum')
    },
    {
        path: '/praktikan/jurnal',
        name: 'praktikan-jurnal',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'student'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/student/jurnal')
    },
    {
        path: '/praktikan/tes_awal',
        name: 'praktikan-tes_awal',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'student'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/student/tes_awal')
    },
    {
        path: '/praktikan/tes_akhir',
        name: 'praktikan-tes_akhir',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'student'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/student/tes_akhir')
    },
    {
        path: '/pengaturan',      
        name: 'praktikan-pengaturan',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'student'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/student/pengaturan')
    },
]
