import httpAxios from '@/httpAxios.js';
// import store from '@/store'

export const api = {
    //auth
    login,
    validateUser,
    register,

    //student
    getAllStudents,
    inputStudent,
    deleteStudent,

    //staff
    getAllStaffs,
    inputStaff,
    getListStaffs,
    deleteStaff,

    //classroom
    getAllClassrooms,
    getListClassrooms,
    getByNameClassrooms,
    inputClassroom,
    deleteClassroom,

    //course
    getAllCourses,
    getListCourses,
    deleteCourse,
    inputCourse,
};

//auth
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

//student
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

//staff
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
function getListStaffs(params) {
    return httpAxios.get('/staff/getall', { params })
}
function deleteStaff(id) {
    return httpAxios.delete(`/staff/${id}`);
}

//classroom
function getAllClassrooms(params) {
    return httpAxios.get('/classroom', { params })
}
function getListClassrooms(params) {
    return httpAxios.get('/classroom/getall', { params })
}
function getByNameClassrooms() {
    return httpAxios.get('/classroom/byname')
}
function deleteClassroom(id) {
    return httpAxios.delete(`/classroom/${id}`);
}
function inputClassroom(data){
    return httpAxios({
        url: '/classroom',
        method: 'POST',
        data: data
    })
}

//course
function getAllCourses(params) {
    return httpAxios.get('/course', { params })
}
function getListCourses(params) {
    return httpAxios.get('/course/getall', { params })
}
function deleteCourse(id) {
    return httpAxios.delete(`/course/${id}`);
}
function inputCourse(data){
    return httpAxios({
        url: '/course',
        method: 'POST',
        data: data
    })
}