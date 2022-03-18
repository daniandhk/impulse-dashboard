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
        path: '/aslab/student-class',
        name: 'aslab-studentclass',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && (role == 'aslab')){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/aslab/student-class/index')
    },
    {
        path: '/aslab/student',
        name: 'aslab-student',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && (role == 'aslab')){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/aslab/student/index')
    },
    {
        path: '/aslab/asprak-class',
        name: 'aslab-asprakclass',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let role = store.getters.getRoleUser
                if(role && (role == 'aslab')){
                    next()
                }
                else{
                    next({ name: 'error-404' })
                }
            },
        },
        component: () => import('../../views/pages/aslab/asprak-class/index')
    },
]
