export const asprakItems = [
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
        label: "menuitems.asprak.text",
        isTitle: true
    },
    {
        id: 4,
        label: 'menuitems.asprak.list.input-soal',
        link: 'asprak-input-soal',
        icon: 'ri-profile-line'
    },
    {
        id: 5,
        label: 'menuitems.asprak.list.berita-acara',
        icon: 'ri-account-circle-line',
        subItems: [
            {
                id: 6,
                label: 'menuitems.asprak.list.cetak-berita-acara',
                link: 'asprak-cetak-berita-acara'
            },
            {
                id: 7,
                label: 'menuitems.asprak.list.berita-acara',
                link: 'asprak-berita-acara'
            }
        ]
    },
    {
        id: 8,
        label: 'menuitems.asprak.list.lihat-feedback',
        icon: 'ri-chat-1-line',
        link: 'asprak-lihat-feedback'
    },
    
]