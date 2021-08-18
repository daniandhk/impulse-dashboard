import httpAxios from '@/httpAxios.js';

export function getAllSchedules(params) {
    return httpAxios.get('/schedule/simple', { params });
}

export function showSchedule(id) {
    return httpAxios.get(`/schedule/${id}`);
}

export function showSchedules(class_course_id, params = null) {
    return httpAxios.get(`/schedule/show_schedule/${class_course_id}`, { params });
}

export function editSchedule(id, data){
    return httpAxios({
        url: `/schedule/${id}`,
        method: 'PUT',
        data: data
    })
}