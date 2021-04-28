const categories = [
    {
        name: 'Danger',
        value: 'bg-danger'
    },
    {
        name: 'Success',
        value: 'bg-success'
    },
    {
        name: 'Primary',
        value: 'bg-primary'
    },
    {
        name: 'Info',
        value: 'bg-info'
    },
    {
        name: 'Dark',
        value: 'bg-dark'
    },
    {
        name: 'Warning',
        value: 'bg-warning'
    },
];

const calendarEvents = [
    {
        id: 2,
        title: 'Aplikasi Berbasis Platform',
        start: new Date().setDate(new Date().getDate() + 1),
        end: new Date().setDate(new Date().getDate() - 1),
        className: 'bg-success text-white',
    },
    {
        id: 4,
        title: 'Algoritma Pemograman',
        start: new Date().setDate(new Date().getDate() + 4),
        className: 'bg-primary text-white'
    },
    {
        id: 5,
        title: 'Aplikasi Berbasis Platform',
        start: new Date().setDate(new Date().getDate() + 8),
        end: new Date().setDate(new Date().getDate() - 8),
        className: 'bg-success text-white',
    },
    {
        id: 6,
        title: 'Algoritma Pemograman',
        start: new Date().setDate(new Date().getDate() + 11),
        className: 'bg-primary text-white'
    },
    {
        id: 7,
        title: 'Aplikasi Berbasis Platform',
        start: new Date().setDate(new Date().getDate() + 15),
        end: new Date().setDate(new Date().getDate() - 15),
        className: 'bg-success text-white',
    },
    {
        id: 8,
        title: 'Algoritma Pemograman',
        start: new Date().setDate(new Date().getDate() + 18),
        className: 'bg-primary text-white'
    },
    {
        id: 5,
        title: 'Aplikasi Berbasis Platform',
        start: new Date().setDate(new Date().getDate() + 22),
        end: new Date().setDate(new Date().getDate() - 22),
        className: 'bg-success text-white',
    },
    {
        id: 6,
        title: 'Algoritma Pemograman',
        start: new Date().setDate(new Date().getDate() + 25),
        className: 'bg-primary text-white'
    },
];

export { categories, calendarEvents };
