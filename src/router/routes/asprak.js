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
        component: () => import('../../views/pages/asprak/schedule/schedule-list')
    },

    {
        path: '/asprak/schedule/:id',
        name: 'asprak-schedule-edit',
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
        component: () => import('../../views/pages/asprak/schedule/schedule-edit')
    },

    // {
    //     path: '/asprak/schedule-practicum/',
    //     name: 'asprak-practicum',
    //     meta: {
    //         authRequired: true,
    //         beforeResolve(routeTo, routeFrom, next) {
    //             let role = store.getters.getRoleUser
    //             if(role && role == 'asprak'){
    //                 next()
    //             }
    //             else{
    //                 next({ name: 'error-404' })
    //             }
    //         },
    //     },
    //     component: () => import('../../views/pages/asprak/practicum/practicum-schedule')
    // },

    {
        path: '/asprak/schedule/:id/practicum',
        name: 'asprak-practicum-detail',
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
        component: () => import('../../views/pages/asprak/practicum/practicum-detail')
    },

    {
        path: '/asprak/schedule-bap/',
        name: 'asprak-bap',
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
        component: () => import('../../views/pages/asprak/bap/list-bap')
    },

    {
        path: '/asprak/schedule/:id/bap/create',
        name: 'asprak-bap-input',
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
        component: () => import('../../views/pages/asprak/bap/input-bap')
    },

    {
        path: '/asprak/schedule/:id/bap',
        name: 'asprak-bap-detail',
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
        component: () => import('../../views/pages/asprak/bap/detail-bap')
    },

    // {
    //     path: '/asprak/schedule-grading/',
    //     name: 'asprak-grading',
    //     meta: {
    //         authRequired: true,
    //         beforeResolve(routeTo, routeFrom, next) {
    //             let role = store.getters.getRoleUser
    //             if(role && role == 'asprak'){
    //                 next()
    //             }
    //             else{
    //                 next({ name: 'error-404' })
    //             }
    //         },
    //     },
    //     component: () => import('../../views/pages/asprak/grading/grading-schedule')
    // },

    {
        path: '/asprak/schedule/:id/grading',
        name: 'asprak-grading-list',
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
        component: () => import('../../views/pages/asprak/grading/grading-list')
    },

    {
        path: '/asprak/:id/grading/:student_id/:type/:test_id',
        name: 'asprak-grading-detail',
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
        component: () => import('../../views/pages/asprak/grading/grading-detail')
    },

    {
        path: '/asprak/schedule/:id/create-test',
        name: 'asprak-schedule-test',
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
        component: () => import('../../views/pages/asprak/schedule/schedule-test')
    },

    //unused
    // {
    //     path: '/asprak/lihat-feedback',
    //     name: 'asprak-lihat-feedback',
    //     meta: {
    //         authRequired: true,
    //         beforeResolve(routeTo, routeFrom, next) {
    //             let role = store.getters.getRoleUser
    //             if(role && role == 'asprak'){
    //                 next()
    //             }
    //             else{
    //                 next({ name: 'error-404' })
    //             }
    //         },
    //     },
    //     component: () => import('../../views/pages/asprak/feedback/lihat-feedback')
    // },
]
