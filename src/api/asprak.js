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