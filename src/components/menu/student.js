export const praktikanItems = [
    {
        id: 1,
        label: "menuitems.menu.text",
        isTitle: true
    },
    {
        id: 2,
        label: 'menuitems.dashboard.text',
        icon: 'ri-dashboard-line',
        link: 'home'
    },
    {
        id: 3,
        label: "menuitems.praktikan.text",
        isTitle: true
    },
    {
        id: 4,
        label: 'menuitems.praktikan.list.jadwal',
        icon: 'ri-calendar-todo-fill',
        subItems: [
            {
                id: 5,
                label: 'menuitems.praktikan.list.kalender',
                link: 'praktikan-jadwal'
            },
            {
                id: 6,
                label: 'menuitems.praktikan.list.matakuliah',
                link: 'praktikan-matakuliah'
            }
        ]
    },
    {
        id: 7,
        label: 'menuitems.praktikan.list.nilai',
        icon: 'ri-bar-chart-grouped-fill',
        link: 'praktikan-nilai'
    },
    // {
    //     id: 8,
    //     label: 'menuitems.praktikan.list.praktikum',
    //     icon: ' ri-suitcase-line',
    //     subItems: [
    //         {
    //             id: 9,
    //             label: 'menuitems.praktikan.list.jurnal',
    //             icon: 'ri-checkbox-blank-circle-line',
    //             link: 'praktikan-jurnal'
    //         },
    //         {
    //             id: 10,
    //             label: 'menuitems.praktikan.list.tes_awal',
    //             link: 'praktikan-tes_awal'
    //         },
    //         {
    //             id: 11,
    //             label: 'menuitems.praktikan.list.tes_akhir',
    //             link: 'praktikan-tes_akhir'
    //         }
    //     ]
    // },
   
]