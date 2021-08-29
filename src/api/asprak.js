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