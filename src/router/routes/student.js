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
    // {
    //     path: '/praktikan/score',
    //     name: 'praktikan-score',
    //     meta: {
    //         authRequired: true,
    //         beforeResolve(routeTo, routeFrom, next) {
    //             let role = store.getters.getRoleUser
    //             if(role && role == 'student'){
    //                 next()
    //             }
    //             else{
    //                 next({ name: 'error-404' })
    //             }
    //         },
    //     },
    //     component: () => import('../../views/pages/student/score/score-list')
    // },
    {
        path: '/praktikan/presence',
        name: 'praktikan-presence',
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
        component: () => import('../../views/pages/student/presence/presence-list')
    },
]
