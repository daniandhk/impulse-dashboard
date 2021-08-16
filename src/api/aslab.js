import httpAxios from '@/httpAxios.js';

export function getAllSchedules(params) {
    return httpAxios.get('/schedule/simple', { params });
}