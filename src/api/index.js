import httpAxios from '@/httpAxios.js';

export const api = {
    login,
    validateUser,
    register,
    inputStudent,
    inputStaff,
};

function login(data){
    return httpAxios({
        url: '/auth/login',
        method: 'POST',
        data: data
    })
}

function validateUser(){
    return httpAxios({
        url: '/me',
        method: 'GET'
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