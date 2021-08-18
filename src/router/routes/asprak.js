export default [
    //path asprak
    {
        path: '/asprak/input-soal',
        name: 'asprak-input-soal',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/asprak/input-soal/input-soal')
    },

    {
        path: '/input-soal/create-test',
        name: 'asprak-input-soal',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/asprak/input-soal/create-test')
    },

    {
        path: '/asprak/lihat-feedback',
        name: 'asprak-lihat-feedback',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/asprak/lihat-feedback')
    },

    {
        path: '/absen/absensi-asprak',
        name: 'asprak-absensi-asprak',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/asprak/absen/absensi-asprak')
    },

    {
        path: '/absen/berita-acara',
        name: 'berita-acara-asprak',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/asprak/absen/berita-acara')
    },
]
