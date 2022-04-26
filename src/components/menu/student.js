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
        label: "menuitems.student.text",
        isTitle: true
    },
    {
        id: 4,
        label: 'menuitems.student.list.jadwal',
        icon: 'ri-calendar-todo-fill',
        subItems: [
            {
                id: 5,
                label: 'menuitems.student.list.kalender',
                link: 'student-schedule-calendar'
            },
            {
                id: 6,
                label: 'menuitems.student.list.matakuliah',
                link: 'student-schedule-list'
            }
        ]
    },
    {
        id: 7,
        label: 'menuitems.student.list.presensi',
        icon: 'ri-bar-chart-grouped-fill',
        link: 'student-presence'
    },
    // {
    //     id: 8,
    //     label: "student.ticketing.text",
    //     isTitle: true
    // },
    // {
    //     id: 9,
    //     label: 'student.ticketing.remotepc.text',
    //     icon: 'ri-remote-control-line',
    //     link: 'student-remotepc'
    // },
]