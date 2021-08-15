import httpAxios from '@/httpAxios.js';

//student class
export function inputStudentClass(data){
    return httpAxios({
        url: '/laboran/student',
        method: 'POST',
        data: data
    })
}
export function getAllStudentClasses(params) {
    if (params){
        return httpAxios.get('/laboran/student', { params })
    }
    else{
        return httpAxios.get('/laboran/student')
    }
}
export function deleteStudentClass(id) {
    return httpAxios.delete(`/laboran/student/${id}`);
}
export function setStudentClass(data){
    return httpAxios({
        url: '/laboran/student/classes',
        method: 'POST',
        data: data
    })
}

//student
export function inputStudent(data){
    return httpAxios({
        url: '/student',
        method: 'POST',
        data: data
    })
}
export function getAllStudents(params) {
    if (params){
        return httpAxios.get('/student', { params })
    }
    else{
        return httpAxios.get('/student')
    }
}
export function deleteStudent(id) {
    return httpAxios.delete(`/student/${id}`);
}
export function editStudent(id, data){
    return httpAxios({
        url: `/student/${id}`,
        method: 'PUT',
        data: data
    })
}
export function showStudent(nim) {
    return httpAxios.get(`/student/${nim}`);
}

//staff
export function inputStaff(data){
    return httpAxios({
        url: '/staff',
        method: 'POST',
        data: data
    })
}
export function getAllStaffs(params) {
    return httpAxios.get('/staff', { params })
}
export function getListStaffs(params) {
    if (params){
        return httpAxios.get('/staff/getall', { params })
    }
    else{
        return httpAxios.get('/staff/getall')
    }
}
export function deleteStaff(id) {
    return httpAxios.delete(`/staff/${id}`);
}
export function editStaff(id, data){
    return httpAxios({
        url: `/staff/${id}`,
        method: 'PUT',
        data: data
    })
}

//classroom
export function getAllClassrooms(params) {
    return httpAxios.get('/classroom', { params })
}
export function getListClassrooms(params) {
    if (params){
        return httpAxios.get('/classroom/getall', { params })
    }
    else{
        return httpAxios.get('/classroom/getall')
    }
}
export function getByNameClassrooms() {
    return httpAxios.get('/classroom/byname')
}
export function deleteClassroom(id) {
    return httpAxios.delete(`/classroom/${id}`);
}
export function inputClassroom(data){
    return httpAxios({
        url: '/classroom',
        method: 'POST',
        data: data
    })
}
export function editClassroom(id, data){
    return httpAxios({
        url: `/classroom/${id}`,
        method: 'PUT',
        data: data
    })
}

//course
export function getAllCourses(params) {
    return httpAxios.get('/course', { params })
}
export function getListCourses(params) {
    if (params){
        return httpAxios.get('/course/getall', { params })
    }
    else{
        return httpAxios.get('/course/getall')
    }
}
export function deleteCourse(id) {
    return httpAxios.delete(`/course/${id}`);
}
export function inputCourse(data){
    return httpAxios({
        url: '/course',
        method: 'POST',
        data: data
    })
}
export function editCourse(id, data){
    return httpAxios({
        url: `/course/${id}`,
        method: 'PUT',
        data: data
    })
}

//room
export function getAllRooms() {
    return httpAxios.get('/room')
}
export function deleteRoom(id) {
    return httpAxios.delete(`/room/${id}`);
}
export function inputRoom(data){
    return httpAxios({
        url: '/room',
        method: 'POST',
        data: data
    })
}
export function editRoom(id, data){
    return httpAxios({
        url: `/room/${id}`,
        method: 'PUT',
        data: data
    })
}

//class-course
export function getAllClassCourses(params) {
    return httpAxios.get('/classcourse', { params })
}
export function showClassCourse(id) {
    return httpAxios.get(`/classcourse/${id}`);
}
export function deleteClassCourse(id) {
    return httpAxios.delete(`/classcourse/${id}`);
}
export function inputClassCourse(data){
    return httpAxios({
        url: '/classcourse',
        method: 'POST',
        data: data
    })
}
export function getClassCourseStaffYear() {
    return httpAxios.get('/classcourse/dropdown/classcoursestaffyear')
}

//roles
export function getRoles(no_induk){
    return httpAxios.get(`/laboran/role/${no_induk}`);
}
export function setRoles(data){
    return httpAxios({
        url: '/laboran/role',
        method: 'POST',
        data: data
    })
}