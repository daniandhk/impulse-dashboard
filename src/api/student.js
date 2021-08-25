import httpAxios from '@/httpAxios.js';

export function getTestSchedule(schedule_id, test_id) {
    return httpAxios.get(`/schedule_test/${schedule_id}/${test_id}`);
}