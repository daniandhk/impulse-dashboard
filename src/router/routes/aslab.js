import store from '@/store'

export default [
    //aslab
    {
        path: '/aslab/schedule/calendar',
        name: 'aslab-schedule-calendar',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'aslab'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/aslab/schedule-calendar')
    },

    {
        path: '/aslab/schedule',
        name: 'aslab-schedule',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'aslab'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/aslab/schedule')
    },

    {
        path: '/aslab/schedule/edit/:id',
        name: 'aslab-schedule-input',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'aslab'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/aslab/schedule-input')
    },

    {
        path: '/aslab/bap',
        name: 'aslab-bap',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'aslab'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/aslab/bap/list-bap')
    },

    {
        path: '/aslab/bap/:id/detail',
        name: 'aslab-bap-detail',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && role == 'aslab'){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/aslab/bap/detail-bap')
    },
]
