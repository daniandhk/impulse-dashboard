export const aslabItems = [
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
        label: "menuitems.aslab.text",
        isTitle: true
    },
    {
        id: 4,
        label: 'menuitems.aslab.list.jadwal',
        icon: 'ri-calendar-todo-fill',
        subItems: [
            {
                id: 5,
                label: 'menuitems.aslab.list.kalender',
                link: 'aslab-schedule-calendar'
            },
            {
                id: 6,
                label: 'menuitems.aslab.list.list',
                link: 'aslab-schedule'
            }
        ]
    },
    {
        id: 7,
        label: 'menuitems.aslab.list.student',
        icon: 'ri-team-fill',
        link: 'aslab-student'
    },
    {
        id: 8,
        label: 'menuitems.aslab.list.studentclass',
        icon: 'mdi mdi-school',
        link: 'aslab-studentclass'
    },
    {
        id: 9,
        label: 'menuitems.aslab.list.asprakclass',
        icon: 'mdi mdi-assistant',
        link: 'aslab-asprakclass'
    },
]