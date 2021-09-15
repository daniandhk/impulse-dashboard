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
        path: '/asprak/bap',
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
        path: '/asprak/bap/:id',
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
        path: '/asprak/bap/:id/detail',
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

    {
        path: '/asprak/grading',
        name: 'asprak-grading',
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
        component: () => import('../../views/pages/asprak/grading/find-schedule')
    },

    {
        path: '/asprak/grading/:id',
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
        component: () => import('../../views/pages/asprak/grading/list-test')
    },

    {
        path: '/asprak/grading/:id/:student_id/:type/:test_id',
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
        component: () => import('../../views/pages/asprak/grading/detail-test')
    },

    //unused
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
        component: () => import('../../views/pages/asprak/feedback/lihat-feedback')
    },
]
