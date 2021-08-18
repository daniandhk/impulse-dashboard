export default [
    {
        path :'*',
        component: () => import('../../views/pages/utility/error-404')
    },
    {
        path :'/about-us',
        name: 'about-us',
        component: () => import('../../views/pages/utility/about-us')
    },
]
