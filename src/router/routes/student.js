export default [
    //path praktikan
    {
        path: '/praktikan/jadwal',
        name: 'praktikan-jadwal',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/student/jadwal')
    },
    {
        path: '/praktikan/matakuliah',
        name: 'praktikan-matakuliah',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/student/matakuliah')
    },
    {
        path: '/praktikan/nilai',
        name: 'praktikan-nilai',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/student/nilai')
    },
    {
        path: '/praktikan/praktikum',
        name: 'praktikan-praktikum',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/student/praktikum')
    },
    {
        path: '/praktikan/jurnal',
        name: 'praktikan-jurnal',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/student/jurnal')
    },
    {
        path: '/praktikan/tes_awal',
        name: 'praktikan-tes_awal',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/student/tes_awal')
    },
    {
        path: '/praktikan/tes_akhir',
        name: 'praktikan-tes_akhir',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/student/tes_akhir')
    },
    {
        path: '/pengaturan',      
        name: 'praktikan-pengaturan',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/student/pengaturan')
    },
]
