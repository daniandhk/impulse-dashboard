import httpAxios from '@/httpAxios.js';

export function getTestSchedule(schedule_id, test_id) {
    return httpAxios.get(`/schedule_test/${schedule_id}/${test_id}`);
}

export function showTest(id) {
    return httpAxios.get(`/schedule/get-test/${id}`);
}

export function showTestSchedule(id) {
    return httpAxios.get(`/schedule_test/${id}`);
}

export function storeEssay(data) {
    return httpAxios({
        url: '/answer/StoreEssay',
        method: 'POST',
        data: data
    })
}

export function storeMultipleChoice(data) {
    return httpAxios({
        url: '/answer/StoreMultipleChoice',
        method: 'POST',
        data: data
    })
}

export function getEssayAnswer(test_id, user_id) {
    return httpAxios.get(`/answer/getEssayAnswer/${test_id}/${user_id}`);
}

export function getMultipleChoiceAnswer(test_id, user_id) {
    return httpAxios.get(`/answer/getMultipleChoiceAnswer/${test_id}/${user_id}`);
}

export function getStudentCourses(id) {
    return httpAxios.get(`/schedule/getstudentcourse/${id}`);
}

export function updateEssay(data) {
    return httpAxios({
        url: '/answer/updateEssayAnswer',
        method: 'PUT',
        data: data
    })
}

export function updateMultipleChoice(data) {
    return httpAxios({
        url: '/answer/updateMultipleChoiceAnswer',
        method: 'PUT',
        data: data
    })
}