import httpAxios from '@/httpAxios.js';

export const api = {
    login,
    register,
    inputStudent,
    inputStaff,
};

function login(data){
    return httpAxios({
        url: '/login',
        method: 'POST',
        data: data
    })
}

function register(data){
    return httpAxios({
        url: '/register',
        method: 'POST',
        data: data
    })
}

function inputStudent(data){
    return httpAxios({
        url: '/students/register',
        method: 'POST',
        data: data
    })
}

function inputStaff(data){
    return httpAxios({
        url: '/staff/register',
        method: 'POST',
        data: data
    })
}