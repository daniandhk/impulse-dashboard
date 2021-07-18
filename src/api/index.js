import httpAxios from '@/httpAxios.js';
// import store from '@/store'

export const api = {
    //auth
    login,
    validateUser,
    register,

    //student class
    getAllStudentClasses,
    inputStudentClass,
    deleteStudentClass,
    setStudentClass,

    //student
    getAllStudents,
    inputStudent,
    deleteStudent,
    editStudent,

    //staff
    getAllStaffs,
    inputStaff,
    getListStaffs,
    deleteStaff,
    editStaff,

    //classroom
    getAllClassrooms,
    getListClassrooms,
    getByNameClassrooms,
    inputClassroom,
    deleteClassroom,
    editClassroom,

    //course
    getAllCourses,
    getListCourses,
    deleteCourse,
    inputCourse,
    editCourse,

    //class-course
    getAllClassCourses,
    deleteClassCourse,
    inputClassCourse,
    getClassCourseStaffYear,

    //roles
    getRoles,
    setRoles,
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

//student class
function inputStudentClass(data){
    return httpAxios({
        url: '/laboran/student',
        method: 'POST',
        data: data
    })
}
function getAllStudentClasses(params) {
    if (params){
        return httpAxios.get('/laboran/student', { params })
    }
    else{
        return httpAxios.get('/laboran/student')
    }
}
function deleteStudentClass(id) {
    return httpAxios.delete(`/laboran/student/${id}`);
}
function setStudentClass(data){
    return httpAxios({
        url: '/laboran/student/classes',
        method: 'POST',
        data: data
    })
}

//student
function inputStudent(data){
    return httpAxios({
        url: '/student',
        method: 'POST',
        data: data
    })
}
function getAllStudents(params) {
    if (params){
        return httpAxios.get('/student', { params })
    }
    else{
        return httpAxios.get('/student')
    }
}
function deleteStudent(id) {
    return httpAxios.delete(`/student/${id}`);
}
function editStudent(id, data){
    return httpAxios({
        url: `/student/${id}`,
        method: 'PUT',
        data: data
    })
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
    if (params){
        return httpAxios.get('/staff/getall', { params })
    }
    else{
        return httpAxios.get('/staff/getall')
    }
}
function deleteStaff(id) {
    return httpAxios.delete(`/staff/${id}`);
}
function editStaff(id, data){
    return httpAxios({
        url: `/staff/${id}`,
        method: 'PUT',
        data: data
    })
}

//classroom
function getAllClassrooms(params) {
    return httpAxios.get('/classroom', { params })
}
function getListClassrooms(params) {
    if (params){
        return httpAxios.get('/classroom/getall', { params })
    }
    else{
        return httpAxios.get('/classroom/getall')
    }
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
function editClassroom(id, data){
    return httpAxios({
        url: `/classroom/${id}`,
        method: 'PUT',
        data: data
    })
}

//course
function getAllCourses(params) {
    return httpAxios.get('/course', { params })
}
function getListCourses(params) {
    if (params){
        return httpAxios.get('/course/getall', { params })
    }
    else{
        return httpAxios.get('/course/getall')
    }
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
function editCourse(id, data){
    return httpAxios({
        url: `/course/${id}`,
        method: 'PUT',
        data: data
    })
}

//class-course
function getAllClassCourses(params) {
    return httpAxios.get('/laboran/class-course', { params })
}
function deleteClassCourse(id) {
    return httpAxios.delete(`/laboran/class-course/${id}`);
}
function inputClassCourse(data){
    return httpAxios({
        url: '/laboran/class-course',
        method: 'POST',
        data: data
    })
}
function getClassCourseStaffYear() {
    return httpAxios.get('/laboran/dropdown/classcoursestaffyear')
}

//roles
function getRoles(no_induk){
    return httpAxios.get(`/laboran/role/${no_induk}`);
}
function setRoles(data){
    return httpAxios({
        url: '/laboran/role',
        method: 'POST',
        data: data
    })
}