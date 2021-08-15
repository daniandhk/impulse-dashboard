export default [
    //aslab
    {
        path: '/aslab/schedule/calendar',
        name: 'aslab-schedule-calendar',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/aslab/schedule-calendar')
    },

    {
        path: '/aslab/schedule',
        name: 'aslab-schedule',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/aslab/schedule')
    },

    {
        path: '/aslab/schedule/:id',
        name: 'aslab-schedule-input',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/aslab/schedule-input')
    },
]
