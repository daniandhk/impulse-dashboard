import httpAxios from '@/httpAxios.js';
// import store from '@/store'

//laboran
export * from "./laboran.js";

//aslab
export * from "./aslab.js";

//student
export * from "./student.js";

//asprak
export * from "./asprak.js";

//auth
export function login(data){
    return httpAxios({
        url: '/auth/login',
        method: 'POST',
        data: data
    })
}
export function validateUser(){
    return httpAxios({
        url: '/me',
        method: 'GET',
        // headers: {
        //     Authorization: 'Bearer ' + store.getters.getLoggedUser.token,
        // },
    })
}
export function register(data){
    return httpAxios({
        url: '/register',
        method: 'POST',
        data: data
    })
}

export function changePassword(data){
    return httpAxios({
        url: `/me/update-password`,
        method: 'PUT',
        data: data
    })
}

export function logout(user_id){
    return httpAxios({
        url: `/auth/logout/${user_id}`,
        method: 'POST',
    })
}