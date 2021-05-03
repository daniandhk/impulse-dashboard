import httpAxios from '@/httpAxios.js';
// import store from '@/store'

export const api = {
    login,
    validateUser,
    register,
    inputStudent,
    inputStaff,
    getAllStudents,
    deleteStudent,
    getAllStaffs,
    deleteStaff,
    getAllClassrooms,
    getListClassrooms,
    getAllCourses,
    getListCourses,
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
        method: 'GET',
        // headers: {
        //     Authorization: 'Bearer ' + store.getters.getLoggedUser.token,
        // },
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
        url: '/laboran/student',
        method: 'POST',
        data: data
    })
}

function getAllStudents(params) {
    return httpAxios.get('/laboran/student', { params })
}

function deleteStudent(id) {
    return httpAxios.delete(`/laboran/student/${id}`);
}

function inputStaff(data){
    return httpAxios({
        url: '/staff',
        method: 'POST',
        data: data
    })
}

function getAllStaffs(params) {
    return httpAxios.get('/staff', { params })
}

function deleteStaff(id) {
    return httpAxios.delete(`/staff/${id}`);
}

function getAllClassrooms(params) {
    return httpAxios.get('/classroom', { params })
}

function getListClassrooms() {
    return httpAxios.get('/classroom/dropdown')
}

function getAllCourses(params) {
    return httpAxios.get('/course', { params })
}

function getListCourses() {
    return httpAxios.get('/course/dropdown')
}