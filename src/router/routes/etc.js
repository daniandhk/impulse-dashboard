export default [
    {
        path :'*',
        name: 'error-404',
        component: () => import('../../views/pages/utility/error-404')
    },
    {
        path :'/about-us',
        name: 'about-us',
        component: () => import('../../views/pages/utility/about-us')
    },
    // {
    //     path :'/temp/create-test',
    //     name: 'create-test',
    //     component: () => import('../../views/pages/temp/create-test')
    // },
]
