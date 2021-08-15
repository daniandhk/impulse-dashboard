export default [
    //aslab
    {
        path: '/aslab/jadwal',
        name: 'aslab-jadwal',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/aslab/calendar-jadwal')
    },

    {
        path: '/aslab/input-jadwal',
        name: 'aslab-input-jadwal',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/aslab/input-jadwal')
    },
]
