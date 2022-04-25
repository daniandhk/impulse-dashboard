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
                link: 'praktikan-schedule-calendar'
            },
            {
                id: 6,
                label: 'menuitems.praktikan.list.matakuliah',
                link: 'praktikan-schedule-list'
            }
        ]
    },
    {
        id: 7,
        label: 'menuitems.praktikan.list.presensi',
        icon: 'ri-bar-chart-grouped-fill',
        link: 'praktikan-presence'
    },
    {
        id: 8,
        label: "praktikan.ticketing.text",
        isTitle: true
    },
    {
        id: 9,
        label: 'praktikan.ticketing.remotepc.text',
        icon: 'ri-remote-control-line',
        link: 'praktikan-remotepc'
    },
]