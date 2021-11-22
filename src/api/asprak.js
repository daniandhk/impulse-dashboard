import httpAxios from '@/httpAxios.js';

export function inputTest(data){
    return httpAxios({
        url: '/schedule/create-test',
        method: 'POST',
        data: data
    })
}

export function deleteTest(id) {
    return httpAxios.delete(`/schedule/delete-test/${id}`);
}

export function inputScheduleTest(data){
    return httpAxios({
        url: '/schedule_test',
        method: 'POST',
        data: data
    })
}

export function editScheduleTest(id, data){
    return httpAxios({
        url: `/schedule_test/${id}`,
        method: 'PUT',
        data: data
    })
}

export function getScheduleGrades(schedule_id) {
    return httpAxios.get(`/grade/schedule/${schedule_id}`);
}

export function getSpecificTest(student_id, test_id) {
    return httpAxios.get(`/grade/test/${student_id}/${test_id}`);
}

export function updateGrade(student_id, data){
    return httpAxios({
        url: `/grade/student/${student_id}`,
        method: 'PUT',
        data: data
    })
}

export function downloadRekapNilai(course_id) {
    return httpAxios({
        url: `/classcourse/export_recap/${course_id}`,
        method: 'GET',
        responseType: 'blob',
    })
}