import store from '@/store'

export default [
    //path student
    {
        path: '/student/schedule/calendar',
        name: 'student-schedule-calendar',
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
        path: '/student/schedule/list',
        name: 'student-schedule-list',
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
        path: '/student/schedule/detail/:id',
        name: 'student-schedule-detail',
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
        path: '/student/:type/:schedule_test_id/:id',
        name: 'student-schedule-test',
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
        path: '/student/presence',
        name: 'student-presence',
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
    {
        path: '/student/remote-pc',
        name: 'student-remotepc',
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
        component: () => import('../../views/pages/student/ticketing/remotepc/index')
    },
]
